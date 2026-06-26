import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersGateway } from './orders.gateway';
import { CreateOrderDto } from './dto/create-order.dto';

const PRICE_PER_KM = 5;
const PLATFORM_FEE = 0.15;


@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private gateway: OrdersGateway,
  ) {}

  private notify(user_id: number, order_id: number, type: any, title: string, body: string) {
    return this.prisma.notification.create({
      data: { user_id, order_id, type, title, body },
    });
  }

  // POST /orders
  async create(clientId: number, dto: CreateOrderDto) {

    const base_fare = dto.distanceKm * PRICE_PER_KM;

    const order = await this.prisma.order.create({
      data: {
        origin:          dto.origin,
        destination:     dto.destination,
        description:     dto.description ?? '',
        distance_km:     dto.distanceKm,
        base_fare:       base_fare,
        suggested_price: base_fare,
        zone:            dto.zone ?? 'ZONA_1',
        client_id:       clientId,
      },
      include: { rating: true },
    });


    // ACA SE ACTIVA LA NOTIFICACION
    
    await this.notify(
      clientId,
      order.id,
      'PEDIDO_CREADO',
      'Pedido creado',
      `Tu pedido de ${dto.origin} a ${dto.destination} fue registrado.`,
    );

    return order;
  }

  // GET /orders/mine
  findMine(clientId: number) {
    return this.prisma.order.findMany({
      where:   { client_id: clientId },
      include: { rating: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // GET /orders/available
  findAvailable() {
    return this.prisma.order.findMany({
      where: { status: 'AVAILABLE' },
      include: { rating: true },
    });
  }

  // GET /orders/rider/active
  findActiveForRider(riderId: number) {
    return this.prisma.order.findFirst({
      where: {
        rider_id: riderId,
        status:   { in: ['ACCEPTED'] },
      },
      include: { rating: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // GET /orders/rider/mine
  findMineAsRider(riderId: number) {
    return this.prisma.order.findMany({
      where:   { rider_id: riderId },
      include: { rating: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // GET /orders/:id
  findOne(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
      include: { rating: true },
    });
  }

  // PATCH /orders/:id/accept
  async accept(id: number, riderId: number) {
  // VALIDAR QUE EL RIDER SOLO TENGA UN PEDIDO A LA VEZ
  const activeOrder = await this.prisma.order.findFirst({
    where: { rider_id: riderId, status: 'ACCEPTED' },
  });

  if (activeOrder) {
    throw new ConflictException('Ya tienes un pedido activo');
  }

  const result = await this.prisma.order.updateMany({
    where: { id, status: 'AVAILABLE' },
    data:  { status: 'ACCEPTED', rider_id: riderId },
  });

  if (result.count === 0) {
    throw new ConflictException('El pedido ya no está disponible');
  }

  const order = await this.findOne(id);

  await this.notify(
      order!.client_id,
      id,
      'PEDIDO_ACEPTADO',
      'Pedido aceptado',
      'Un repartidor aceptó tu pedido y va en camino a recogerlo.',
    );

  this.gateway.emitOrderUpdated(order!);
  return order;
}

  // PATCH /orders/:id/deliver
  async deliver(id: number, riderId: number) {
    const order = await this.prisma.order.findUnique({ where: { id } });

    if (!order || order.rider_id !== riderId) {
      throw new ForbiddenException('No estás asignado a este pedido');
    }
    if (order.status !== 'ACCEPTED') {
      throw new ConflictException('El pedido no está en estado ACCEPTED');
    }

    await this.prisma.order.update({
      where: { id },
      data:  { status: 'DELIVERED' },
    });

    // Calcular y registrar ganancias del rider
    const gross = Number(order.final_price ?? order.base_fare ?? 0);
    const fee   = Math.round(gross * PLATFORM_FEE * 100) / 100;
    const net   = Math.round((gross - fee) * 100) / 100;

    await this.prisma.riderEarnings.create({
      data: {
        rider_id:     riderId,
        order_id:     id,
        gross_amount: gross,
        platform_fee: fee,
        net_amount:   net,
      },
    });

    // Notificar al cliente que su pedido fue entregado
    await this.notify(
      order.client_id,
      id,
      'ENTREGADO',
      '¡Pedido entregado!',
      'Tu paquete fue entregado. ¡Califica el servicio!',
    );

    // Notificar al rider sobre el pago
    await this.notify(
      riderId,
      id,
      'PAGO_PROCESADO',
      'Pago procesado',
      `Se registraron Q${net.toFixed(2)} en tus ganancias.`,
    );

    const updated = await this.findOne(id);
    this.gateway.emitOrderUpdated(updated!);
    return updated;
  }

  // POST /orders/:id/rating
  async rate(id: number, clientId: number, stars: number, comment?: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });

    if (!order || order.client_id !== clientId) {
      throw new ForbiddenException('Este pedido no te pertenece');
    }

    if (order.status !== 'DELIVERED') {
      throw new ConflictException('El pedido aún no fue entregado');
    }

    const rating = await this.prisma.rating.create({
      data: {
        order_id:  id,
        client_id: clientId,
        rider_id:  order.rider_id!,
        stars,
        comment,
      },
    });

    const updatedOrder = await this.findOne(id);
    this.gateway.emitOrderUpdated(updatedOrder!);

    return rating;
  }
}
