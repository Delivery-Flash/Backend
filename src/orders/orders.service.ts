import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersGateway } from './orders.gateway';
import { CreateOrderDto } from './dto/create-order.dto';

const PRICE_PER_KM = 5;

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private gateway: OrdersGateway,
  ) {}

  // POST /orders
  create(clientId: number, dto: CreateOrderDto) {
    return this.prisma.order.create({
      data: {
        origin: dto.origin,
        destination: dto.destination,
        description: dto.description,
        price: dto.distanceKm * PRICE_PER_KM,
        clientId,
      },
      include: { rating: true },
    });
  }

  // GET /orders/mine
  findMine(clientId: number) {
    return this.prisma.order.findMany({
      where: { clientId },
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
      where: { riderId, status: { in: ['ACCEPTED', 'DELIVERED'] } },
      include: { rating: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  // GET /orders/rider/mine
  findMineAsRider(riderId: number) {
    return this.prisma.order.findMany({
      where: { riderId },
      include: { rating: true },
      orderBy: { updatedAt: 'desc' },
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
    const result = await this.prisma.order.updateMany({
      where: { id, status: 'AVAILABLE' },
      data: { status: 'ACCEPTED', riderId },
    });

    if (result.count === 0) {
      throw new ConflictException('El pedido ya no está disponible');
    }

    const order = await this.findOne(id);
    this.gateway.emitOrderUpdated(order!);
    return order;
  }

  // PATCH /orders/:id/deliver
  async deliver(id: number, riderId: number) {
    const order = await this.prisma.order.findUnique({ where: { id } });

    if (!order || order.riderId !== riderId) {
      throw new ForbiddenException('No estás asignado a este pedido');
    }

    await this.prisma.order.update({
      where: { id },
      data: { status: 'DELIVERED' },
    });

    const updated = await this.findOne(id);
    this.gateway.emitOrderUpdated(updated!);
    return updated;
  }

  // POST /orders/:id/rating
  async rate(id: number, clientId: number, stars: number) {
    const order = await this.prisma.order.findUnique({ where: { id } });

    if (!order || order.clientId !== clientId) {
      throw new ForbiddenException('Este pedido no te pertenece');
    }

    if (order.status !== 'DELIVERED') {
      throw new ConflictException('El pedido aún no fue entregado');
    }

    const rating = await this.prisma.rating.create({ data: { orderId: id, stars } });

    const updatedOrder = await this.findOne(id);
    this.gateway.emitOrderUpdated(updatedOrder!);

    return rating;
  }
}
