import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EarningsService {
  constructor(private prisma: PrismaService) {}

  // Historial de ganancias de un rider
  findByRider(riderId: number) {
    return this.prisma.riderEarnings.findMany({
      where:   { rider_id: riderId },
      orderBy: { createdAt: 'desc' },
      include: {
        order: {
          select: { origin: true, destination: true, createdAt: true },
        },
      },
    });
  }

  // Resumen de ganancias de un rider
  async getSummary(riderId: number) {
    const earnings = await this.prisma.riderEarnings.aggregate({
      where: { rider_id: riderId },
      _sum:  { gross_amount: true, platform_fee: true, net_amount: true },
      _count: { id: true },
    });

    return {
      total_trips:    earnings._count.id,
      total_gross:    earnings._sum.gross_amount ?? 0,
      total_fees:     earnings._sum.platform_fee ?? 0,
      total_earned:   earnings._sum.net_amount   ?? 0,
    };
  }

  // Resumen de todos los riders (admin)
  async getAllSummary() {
    const riders = await this.prisma.riderEarnings.groupBy({
      by:    ['rider_id'],
      _sum:  { gross_amount: true, platform_fee: true, net_amount: true },
      _count: { id: true },
      orderBy: { _sum: { net_amount: 'desc' } },
    });

    // Enriquecer con nombre del rider
    const enriched = await Promise.all(
      riders.map(async (r) => {
        const user = await this.prisma.user.findUnique({
          where:  { id: r.rider_id },
          select: { first_name: true, last_name: true, email: true },
        });
        return {
          rider_id:     r.rider_id,
          rider_name:   `${user?.first_name} ${user?.last_name}`,
          email:        user?.email,
          total_trips:  r._count.id,
          total_gross:  r._sum.gross_amount ?? 0,
          total_fees:   r._sum.platform_fee ?? 0,
          total_earned: r._sum.net_amount   ?? 0,
        };
      }),
    );

    return enriched;
  }
}