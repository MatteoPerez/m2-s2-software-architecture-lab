import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoggingService } from '../../../../shared/logging/domain/services/logging.service';
import { LoginDto } from '../../application/dtos/login.dto';
import { LoginUseCase } from '../../application/use-cases/login.use-case';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly loggingService: LoggingService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Authenticate and get an access token' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 201,
    description: 'Authentication successful',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid credentials or malformed payload' })
  public async login(
    @Body() input: LoginDto,
  ): Promise<{ access_token: string }> {
    this.loggingService.log('login');
    const { accessToken } = await this.loginUseCase.execute(input);

    return { access_token: accessToken };
  }
}
