import {
  Controller,
  Post,
  Response,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../entities/user.entity';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LoginInput } from '../input/login.input';
import { ResetPasswordByEmailInput } from '../input/reset.password.by.email.input';
import { object, string } from 'joi';
import { AuthGuard } from './guards/auth.guard';
import { User as UserDecorator } from '../decorators/user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: LoginInput })
  @ApiOperation({
    summary: 'Login by email',
  })
  @ApiOkResponse({
    status: 200,
    type: object,
    description: 'Login user successfully',
  })
  @ApiBadRequestResponse({
    status: 403,
    type: string,
    description: 'Login user failed',
  })
  @Post('login')
  async loginUser(@Response() res: any, @Body() body: LoginInput) {
    return this.authService.loginUser(res, body);
  }

  @ApiBody({ type: ResetPasswordByEmailInput })
  @UseGuards(AuthGuard)
  @ApiBearerAuth('idToken')
  @ApiOperation({
    summary: 'Reset password by email',
  })
  @ApiOkResponse({
    status: 200,
    type: object,
    description: 'Reset password by email successfully',
  })
  @ApiBadRequestResponse({
    status: 403,
    type: string,
    description: 'Reset password by email failed',
  })
  @Post('resetPassword')
  async resetPassword(
    @UserDecorator() user: User,
    @Response() res: any,
    @Body() body: ResetPasswordByEmailInput,
  ) {
    return this.authService.resetPassword(res, user, body);
  }
}
