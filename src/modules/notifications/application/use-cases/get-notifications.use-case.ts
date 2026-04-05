import { Injectable } from "@nestjs/common";
import { NotificationRepository } from "../../domain/repositories/notification.repository";

@Injectable()
export class GetNotificationsUseCase {
    constructor(private readonly notificationRepository: NotificationRepository) {}

    public async execute(userId: string, page: number, pageSize: number, isReadFilter?: string) {
        let isRead: boolean | undefined;
        
        if (isReadFilter === 'true') isRead = true;
        else if (isReadFilter === 'false') isRead = false;
        else isRead = undefined;

        const { notifications, total, unreadCount } = await this.notificationRepository.findByRecipient(
            userId,
            page,
            pageSize,
            isRead
        );

        return {
            notifications: notifications.map(n => n.toJSON()),
            total,
            unreadCount,
            page,
            pageSize
        };
    }
}