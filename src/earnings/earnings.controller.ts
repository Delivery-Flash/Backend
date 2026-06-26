import {
  Controller, Get, Param,
  ParseIntPipe, Req, UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { EarningsService } from './earnings.service';
interface RequestWithUser extends Request {
  user: { userId: number; email: string; role: string };
}

@Controller('earnings')
@UseGuards(JwtAuthGuard)
export class EarningsController {
  constructor(private earningsService: EarningsService) {}

  // GET /earnings/mine  — el rider ve sus propias ganancias
  @Get('mine')
  findMine(@Req() req: RequestWithUser) {
    if (req.user.role !== 'RIDER') {
      throw new ForbiddenException('Solo los riders pueden ver sus ganancias');
    }
    return this.earningsService.findByRider(req.user.userId);
  }

  // GET /earnings/mine/summary  — resumen total del rider
  @Get('mine/summary')
  getMySummary(@Req() req: RequestWithUser) {
    if (req.user.role !== 'RIDER') {
      throw new ForbiddenException('Solo los riders pueden ver sus ganancias');
    }
    return this.earningsService.getSummary(req.user.userId);
  }

  // GET /earnings/rider/:riderId  — admin ve ganancias de un rider específico
  @Get('rider/:riderId')
  findByRider(
    @Param('riderId', ParseIntPipe) riderId: number,
    @Req() req: RequestWithUser,
  ) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Solo el admin puede ver ganancias de otros riders');
    }
    return this.earningsService.findByRider(riderId);
  }

  // GET /earnings/summary  — admin ve resumen de todos los riders
  @Get('summary')
  getAllSummary(@Req() req: RequestWithUser) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Solo el admin puede ver este reporte');
    }
    return this.earningsService.getAllSummary();
  }
}