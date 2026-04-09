import { Controller, Post, Delete, Param, Get, UseGuards, HttpCode, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FollowUserUseCase } from '../../application/use-cases/follow-user.use-case';
import { Requester } from 'src/modules/shared/auth/infrastructure/decorators/requester.decorator';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { UnfollowUserUseCase } from '../../application/use-cases/unfollow-user.use-case';
import { GetFollowersUseCase } from '../../application/use-cases/get-followers.use-case';
import { GetFollowingUseCase } from '../../application/use-cases/get-following.use-case';
import { JwtAuthGuard } from 'src/modules/shared/auth/infrastructure/guards/jwt-auth.guard';

@ApiTags('Subscriptions')
@Controller('users')
export class SubscriptionController {
    constructor(
        private readonly followUserUseCase: FollowUserUseCase,
        private readonly unfollowUserUseCase: UnfollowUserUseCase,
        private readonly getFollowersUseCase: GetFollowersUseCase,
        private readonly getFollowingUseCase: GetFollowingUseCase,
    ) { }

    @Post(':id/follow')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Follow a user' })
    @ApiResponse({ status: 201, description: 'User followed successfully.' })
    @ApiResponse({ status: 400, description: 'Attempt to follow oneself.' })
    @ApiResponse({ status: 404, description: 'Target user not found.' })
    public async follow(
        @Param('id') targetUserId: string,
        @Requester() user: UserEntity,
    ) {
        await this.followUserUseCase.execute(user.id, targetUserId);
        return { message: 'Successfully followed' };
    }

    @Delete(':id/unfollow')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Unfollow a user' })
    @ApiResponse({ status: 200, description: 'User unfollowed successfully.' })
    @ApiResponse({ status: 404, description: 'Target user not found.' })
    public async unfollow(
        @Param('id') targetUserId: string,
        @Requester() user: UserEntity,
    ) {
        await this.unfollowUserUseCase.execute(user.id, targetUserId);
        return { message: 'Successfully unfollowed' };
    }

    @Get(':id/followers')
    @ApiOperation({ summary: 'Get the followers of a user' })
    @ApiResponse({ status: 200, description: 'List of followers retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Target user not found.' })
    public async getFollowers(
        @Param('id') userId: string,
        @Query('page') page: number = 1,
        @Query('pageSize') pageSize: number = 20,
    ) {
        const limit = Math.min(pageSize, 100);
        
        return await this.getFollowersUseCase.execute(userId, Number(page), Number(limit));
    }

    @Get(':id/following')
    @ApiOperation({ summary: 'Get the users that a user is following' })
    @ApiResponse({ status: 200, description: 'List of following retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Target user not found.' })
    public async getFollowing(
        @Param('id') userId: string,
        @Query('page') page: number = 1,
        @Query('pageSize') pageSize: number = 20,
    ) {
        const limit = Math.min(pageSize, 100);
        return await this.getFollowingUseCase.execute(userId, Number(page), Number(limit));
    }
}