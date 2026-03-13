import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentDto {
    @ApiProperty({ 
        description: 'Content of the comment', 
        example: 'Nice post! I really enjoyed reading it.' 
    })
    content: string;
}