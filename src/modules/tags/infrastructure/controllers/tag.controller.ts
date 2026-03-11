import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { Requester } from '../../../shared/auth/infrastructure/decorators/requester.decorator';
import { JwtAuthGuard } from '../../../shared/auth/infrastructure/guards/jwt-auth.guard';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { CreateTagDto } from '../../application/dtos/create-tag.dto';
import { UpdateTagDto } from '../../application/dtos/update-tag.dto';
import { CreateTagUseCase } from '../../application/use-cases/create-tag.use-case';
import { DeleteTagUseCase } from '../../application/use-cases/delete-tag.use-case';
import { GetTagByIdUseCase } from '../../application/use-cases/get-tag-by-id.use-case';
import { GetTagsUseCase } from '../../application/use-cases/get-tags.use-case';
import { UpdateTagUseCase } from '../../application/use-cases/update-tag.use-case';

@Controller('posts')
export class TagController {
    constructor(
        private readonly createTagUseCase: CreateTagUseCase,
        private readonly updateTagUseCase: UpdateTagUseCase,
        private readonly deleteTagUseCase: DeleteTagUseCase,
        private readonly getTagsUseCase: GetTagsUseCase,
        private readonly getTagByIdUseCase: GetTagByIdUseCase,
    ) {}

    @Get()
    public async getTags() {
        const tags = await this.getTagsUseCase.execute();

        return tags.map((t) => t.toJSON());
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    public async getTagById(
        @Param('id') id: string,
    ) {
        const tag = await this.getTagByIdUseCase.execute(id);

        return tag?.toJSON();
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    public async createTag(
        @Requester() user: UserEntity,
        @Body() input: Omit<CreateTagDto, 'authorId'>,
    ) {
        return this.createTagUseCase.execute(input, user);
    }

    @Patch(':id')
    public async updateTag(
        @Param('id') id: string,
        @Body() input: UpdateTagDto,
    ) {
        return this.updateTagUseCase.execute(id, input);
    }

    @Delete(':id')
    public async deleteTag(@Param('id') id: string) {
        return this.deleteTagUseCase.execute(id);
    }
}
