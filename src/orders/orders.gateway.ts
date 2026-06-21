import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Prisma } from '@prisma/client';

type OrderWithRating = Prisma.OrderGetPayload<{ include: { rating: true } }>;

@WebSocketGateway({
  cors: { origin: 'http://localhost:5173', credentials: true },
})
export class OrdersGateway {
  @WebSocketServer() server!: Server;

  emitOrderUpdated(order: OrderWithRating) {
    this.server.emit('order:updated', order);
  }
}
