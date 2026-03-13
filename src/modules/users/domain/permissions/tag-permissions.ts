import { UserRole } from '../entities/user.entity';

export class TagPermissions {
    constructor(
        private readonly role: UserRole,
    ) {}

    public isAdmin(): boolean {
        return this.role === 'admin';
    }
}