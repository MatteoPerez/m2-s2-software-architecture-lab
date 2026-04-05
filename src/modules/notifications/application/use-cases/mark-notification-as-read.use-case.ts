import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { NotificationRepository } from "../../domain/repositories/notification.repository";
import { NotificationEntity } from "../../domain/entities/notification.entity";

@Injectable()
export class MarkNotificationAsReadUseCase {
    constructor(private readonly notificationRepository: NotificationRepository) {}

    public async execute(notificationId: string, userId: string): Promise<NotificationEntity> {

        const notification = await this.notificationRepository.findById(notificationId);

        if (!notification) {
            throw new NotFoundException(`Notification avec l'ID ${notificationId} introuvable`);
        }

        if (notification.recipientId !== userId) {
            throw new ForbiddenException("Vous n'êtes pas autorisé à marquer cette notification comme lue");
        }

        notification.markAsRead();

        await this.notificationRepository.save(notification);

        return notification;
    }
}