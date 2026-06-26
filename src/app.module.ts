import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from './orders/orders.module';
import { NotificationsModule } from './notifications/notifications.module';
import { EarningsModule } from './earnings/earnings.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, PrismaModule, OrdersModule, NotificationsModule, EarningsModule, ReportsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
