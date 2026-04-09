import { ApiProperty } from "@nestjs/swagger";

export class UpdateCommentDto {
    @ApiProperty({ 
        description: 'New content of the comment', 
        example: 'This is an updated comment content.'
    })
    content!: string;
}