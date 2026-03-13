import { UserEntity } from "src/modules/users/domain/entities/user.entity";
import { CommentEntity } from "../entities/comment.entity";

export class CommentPermissions {
    constructor(
        private readonly user: UserEntity,
        private readonly comment: CommentEntity,
        private readonly postAuthorId?: string
    ) {}

    public canUpdate(): boolean {
        return this.user.id === this.comment.authorId;
    }

    public canDelete(): boolean {
        if (this.user.role === 'admin' || this.user.role === 'moderator') {
            return true;
        }

        if (this.user.id === this.comment.authorId) {
            return true;
        }

        if (this.postAuthorId && this.user.id === this.postAuthorId) {
            return true;
        }

        return false;
    }
}