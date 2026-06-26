import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsService } from './notifications.service';

@Module({
  imports:     [PrismaModule],
  controllers: [NotificationsController],
  providers:   [NotificationsService],
  exports:     [NotificationsService],
})
export class NotificationsModule {}