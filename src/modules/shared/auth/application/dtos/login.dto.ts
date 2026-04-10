import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'writer_user' })
  username!: string;

  @ApiProperty({ example: 'password123' })
  password!: string;
}
