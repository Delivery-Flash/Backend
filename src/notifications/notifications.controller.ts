import {
  Controller, Get, Patch, Param,
  ParseIntPipe, Req, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

interface RequestWithUser extends Request {
  user: { userId: number; email: string; role: string };
}

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  findAll(@Req() req: RequestWithUser) {
    return this.notificationsService.findAll(req.user.userId);
  }

  // GET /notifications/unread  — solo las no leídas
  @Get('unread')
  findUnread(@Req() req: RequestWithUser) {
    return this.notificationsService.findUnread(req.user.userId);
  }

  // PATCH /notifications/:id/read  — marcar una como leída
  @Patch(':id/read')
  @HttpCode(HttpStatus.OK)
  markRead(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ) {
    return this.notificationsService.markRead(id, req.user.userId);
  }

  // PATCH /notifications/read-all  — marcar todas como leídas
  @Patch('read-all')
  @HttpCode(HttpStatus.OK)
  markAllRead(@Req() req: RequestWithUser) {
    return this.notificationsService.markAllRead(req.user.userId);
  }
}