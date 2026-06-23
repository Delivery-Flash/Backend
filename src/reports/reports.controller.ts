import {
  Controller,
  Get,
  Patch,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ReportsService } from './reports.service';
import { Request } from 'express';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class ReportsController {

    constructor(
    private readonly reportsService: ReportsService,
  ) {}

  @Get('users')
  findAllUsers(@Req() req: Request & { user: { userId: number; role: string } }) {
    if (req.user?.role !== 'ADMIN') throw new ForbiddenException('Acceso denegado');
    return this.reportsService.findAllUsers();
  }

  @Get('riders/pending')
  findPendingRiders(@Req() req: Request & { user: { userId: number; role: string } }) {
    if (req.user?.role !== 'ADMIN') throw new ForbiddenException('Acceso denegado');
    return this.reportsService.findPendingRiders();
  }

  @Patch('riders/:id/verify')
  verifyRider(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: { userId: number; role: string } },
  ) {
    if (req.user?.role !== 'ADMIN') throw new ForbiddenException('Acceso denegado');
    return this.reportsService.verifyRider(id);
  }

  @Get('reports/orders')
  getOrdersReport(@Req() req: Request & { user: { userId: number; role: string } }) {
    if (req.user?.role !== 'ADMIN') throw new ForbiddenException('Acceso denegado');
    return this.reportsService.getOrdersReport();
  }

  @Get('reports/earnings')
  getEarningsReport(@Req() req: Request & { user: { userId: number; role: string } }) {
    if (req.user?.role !== 'ADMIN') throw new ForbiddenException('Acceso denegado');
    return this.reportsService.getEarningsReport();
  }

  @Get('reports/riders')
  getTopRiders(@Req() req: Request & { user: { userId: number; role: string } }) {
    if (req.user?.role !== 'ADMIN') throw new ForbiddenException('Acceso denegado');
    return this.reportsService.getTopRiders();
  }

  @Get('riders')
  getAllRiders(@Req() req: Request & { user: { userId: number; role: string } }) {
    if (req.user?.role !== 'ADMIN') throw new ForbiddenException('Acceso denegado');
    return this.reportsService.findAllRiders();
  }
}