import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { OrdersService } from './orders.service';
import { RateOrderDto } from './dto/rate-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';

interface RequestWithUser extends Request {
  user: { userId: number; email: string; role: string };
}

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  // POST /orders
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Req() req: RequestWithUser, @Body() dto: CreateOrderDto) {
    if (req.user.role !== 'CLIENT') {
      throw new ForbiddenException('Solo los clientes crean pedidos');
    }
    return this.ordersService.create(req.user.userId, dto);
  }

  // GET /orders/mine  (debe ir ANTES de GET /orders/:id, si no Nest cree que "mine" es un :id)
  @Get('mine')
  getMine(@Req() req: RequestWithUser) {
    if (req.user.role !== 'CLIENT') {
      throw new ForbiddenException('Solo los clientes consultan sus pedidos');
    }
    return this.ordersService.findMine(req.user.userId);
  }

  // GET /orders/available  (misma razón: literal antes que ':id')
  @Get('available')
  getAvailable(@Req() req: RequestWithUser) {
    if (req.user.role !== 'RIDER') {
      throw new ForbiddenException('Solo los repartidores ven el tablero de pedidos');
    }
    return this.ordersService.findAvailable();
  }

  // GET /orders/:id
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

    // GET /orders/rider/active
  @Get('rider/active')
  getActiveForRider(@Req() req: RequestWithUser) {
    if (req.user.role !== 'RIDER') {
      throw new ForbiddenException('Solo los repartidores consultan su pedido activo');
    }
    return this.ordersService.findActiveForRider(req.user.userId);
  }

  // GET /orders/rider/mine
  @Get('rider/mine')
  getMineAsRider(@Req() req: RequestWithUser) {
    if (req.user.role !== 'RIDER') {
      throw new ForbiddenException('Solo los repartidores consultan su historial');
    }
    return this.ordersService.findMineAsRider(req.user.userId);
  }


  // PATCH /orders/:id/accept
  @Patch(':id/accept')
  @HttpCode(HttpStatus.OK)
  accept(@Param('id', ParseIntPipe) id: number, @Req() req: RequestWithUser) {
    if (req.user.role !== 'RIDER') {
      throw new ForbiddenException('Solo los repartidores aceptan pedidos');
    }
    return this.ordersService.accept(id, req.user.userId);
  }

  // PATCH /orders/:id/deliver
  @Patch(':id/deliver')
  @HttpCode(HttpStatus.OK)
  deliver(@Param('id', ParseIntPipe) id: number, @Req() req: RequestWithUser) {
    if (req.user.role !== 'RIDER') {
      throw new ForbiddenException('Solo los repartidores marcan entregas');
    }
    return this.ordersService.deliver(id, req.user.userId);
  }

  // POST /orders/:id/rating
  @Post(':id/rating')
  @HttpCode(HttpStatus.CREATED)
  rate(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
    @Body() dto: RateOrderDto,
  ) {
    if (req.user.role !== 'CLIENT') {
      throw new ForbiddenException('Solo los clientes califican el servicio');
    }
    return this.ordersService.rate(id, req.user.userId, dto.stars, dto.comment);
  }
}
