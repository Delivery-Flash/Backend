import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  findAll(userId: number) {
    return this.prisma.notification.findMany({
      where:   { user_id: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  findUnread(userId: number) {
    return this.prisma.notification.findMany({
      where:   { user_id: userId, is_read: false },
      orderBy: { createdAt: 'desc' },
    });
  }

  markRead(notifId: number, userId: number) {
    return this.prisma.notification.updateMany({
      where: { id: notifId, user_id: userId },
      data:  { is_read: true },
    });
  }

  markAllRead(userId: number) {
    return this.prisma.notification.updateMany({
      where: { user_id: userId, is_read: false },
      data:  { is_read: true },
    });
  }
}