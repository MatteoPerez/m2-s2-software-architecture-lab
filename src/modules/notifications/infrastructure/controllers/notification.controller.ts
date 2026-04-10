import { Controller, Get, Post, Patch, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { GetNotificationsUseCase } from '../../application/use-cases/get-notifications.use-case';
import { MarkAllNotificationsAsReadUseCase } from '../../application/use-cases/mark-all-read.use-case';
import { JwtAuthGuard } from 'src/modules/shared/auth/infrastructure/guards/jwt-auth.guard';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { Requester } from 'src/modules/shared/auth/infrastructure/decorators/requester.decorator';
import { MarkNotificationAsReadUseCase } from '../../application/use-cases/mark-notification-as-read.use-case';

@ApiTags('Notifications')
@Controller('notifications')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
export class NotificationController {
    constructor(
        private readonly getNotificationsUseCase: GetNotificationsUseCase,
        private readonly markAllReadUseCase: MarkAllNotificationsAsReadUseCase,
        private readonly markNotificationAsReadUseCase: MarkNotificationAsReadUseCase,
    ) { }

    @Get()
    @ApiOperation({ summary: 'Get my notifications with pagination and read/unread filter' })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'pageSize', required: false, example: 20 })
    @ApiQuery({ name: 'isRead', enum: ['true', 'false', 'all'], required: false, default: 'all' })
    @ApiResponse({
        status: 200,
        description: 'List of paginated notifications',
        schema: {
            example: {
                notifications: [{
                    id: '6b6b31cd-1c3a-4eb0-9445-ac41ed7349cf',
                    recipientId: 'b59f90d1-e243-4f67-b658-68ce03e92a87',
                    type: 'NEW_COMMENT',
                    title: 'New comment on your post',
                    message: 'alex_writer commented on "Designing Event-Driven APIs".',
                    link: '/posts/designing-event-driven-apis',
                    isRead: false,
                    createdAt: '2026-04-10T09:30:00.000Z',
                    metadata: { postId: 'f8f64566-4ce9-4d9f-9675-20cf636db78f' }
                }],
                total: 45,
                unreadCount: 12,
                page: 1,
                pageSize: 20
            }
        }
    })
    public async getMyNotifications(
        @Requester() user: UserEntity,
        @Query('page') page: number = 1,
        @Query('pageSize') pageSize: number = 20,
        @Query('isRead') isRead: string = 'all'
    ) {
        return await this.getNotificationsUseCase.execute(
            user.id,
            Number(page),
            Number(pageSize),
            isRead
        );
    }

    @Patch(':id/read')
    @ApiOperation({ summary: 'Mark a notification as read' })
    @ApiResponse({ status: 200, description: 'The notification has been marked as read' })
    @ApiResponse({ status: 403, description: 'This notification does not belong to you' })
    @ApiResponse({ status: 404, description: 'Notification not found' })
    public async markAsRead(
        @Param('id') id: string,
        @Requester() user: UserEntity
    ) {
        return await this.markNotificationAsReadUseCase.execute(id, user.id);
    }

    @Post('mark-all-read')
    @ApiOperation({ summary: 'Mark all notifications as read' })
    @ApiResponse({
        status: 201,
        description: 'All notifications have been marked as read',
        schema: { example: { markedCount: 5 } }
    })
    public async markAllRead(@Requester() user: UserEntity) {
        return await this.markAllReadUseCase.execute(user.id);
    }
}