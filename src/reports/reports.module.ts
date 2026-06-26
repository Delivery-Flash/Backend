import { Module } from '@nestjs/common';


import { ReportsService } from './reports.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ReportsController } from './reports.controller';

@Module({
  imports: [
    PrismaModule,
  ],

  controllers: [
    ReportsController,
  ],

  providers: [
    ReportsService,
  ],

  exports: [
    ReportsService,
  ],
})
export class ReportsModule {}