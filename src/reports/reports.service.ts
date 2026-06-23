import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  OrderStatus,
  Prisma,
} from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        role: true,
        is_active: true,
        profile_photo: true,
        createdAt: true,
        riderProfile: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllRiders() {
    return this.prisma.user.findMany({
      where: { role: 'RIDER' },
      include: { riderProfile: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPendingRiders() {
    return this.prisma.user.findMany({
      where: {
        role: 'RIDER',
        riderProfile: { is_verified: false },
      },
      include: { riderProfile: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async verifyRider(id: number) {
    const profile = await this.prisma.riderProfile.findUnique({ where: { user_id: id } });
    if (!profile) throw new NotFoundException('Perfil de repartidor no encontrado');
    return this.prisma.riderProfile.update({ where: { user_id: id }, data: { is_verified: true } });
  }

  async getOrdersReport() {
    const totalOrders = await this.prisma.order.count();

    const byStatusGroups = await this.prisma.order.groupBy({
      by: ['status'],
      _count: { id: true },
    });

    const byStatus: Record<string, number> = {};
    byStatusGroups.forEach((g) => {
      byStatus[g.status] = g._count.id;
    });

    const byZoneGroups = await this.prisma.order.groupBy({
      by: ['zone'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    const byZone: Record<string, number> = {};
    byZoneGroups.forEach((g) => {
      byZone[g.zone] = g._count.id;
    });

    return { totalOrders, byStatus, byZone };
  }

  async getEarningsReport() {
    const agg = await this.prisma.riderEarnings.aggregate({
      _count: { id: true },
      _sum: { net_amount: true, gross_amount: true, platform_fee: true },
    });

    return {
      totalRecords: agg._count.id ?? 0,
      totalNet: Number(agg._sum.net_amount ?? 0),
      totalGross: Number(agg._sum.gross_amount ?? 0),
      totalFee: Number(agg._sum.platform_fee ?? 0),
    };
  }

  async getTopRiders(limit = 10) {
    const groups = await this.prisma.riderEarnings.groupBy({
      by: ['rider_id'],
      _sum: { net_amount: true, gross_amount: true },
      orderBy: { _sum: { net_amount: 'desc' } },
      take: limit,
    });

    const result = await Promise.all(
      groups.map(async (g) => {
        const user = await this.prisma.user.findUnique({ where: { id: g.rider_id } });
        return {
          riderId: g.rider_id,
          name: user ? `${user.first_name} ${user.last_name}` : null,
          email: user?.email ?? null,
          totalNet: Number(g._sum.net_amount ?? 0),
          totalGross: Number(g._sum.gross_amount ?? 0),
        };
      }),
    );

    return result;
  }
}