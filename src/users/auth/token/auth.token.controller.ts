import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RegisterInput } from '../../input/register.input';
import { object, string } from 'joi';
import { Body, Controller, Get, Param, Post, Response } from '@nestjs/common';
import { ResetCodeInput } from '../../input/reset.code.input';
import { ResetTokenInput } from '../../input/reset.token.input';
import { AuthTokenService } from './auth.token.service';
import { User } from '../../entities/user.entity';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

@ApiTags('Auth Token')
@Controller('auth')
export class AuthTokenController {
  constructor(private readonly authTokenService: AuthTokenService) {}

  @ApiBody({ type: RegisterInput })
  @ApiOperation({
    summary: 'Register by email',
  })
  @ApiOkResponse({
    status: 200,
    type: object,
    description: 'Register user successfully',
  })
  @ApiBadRequestResponse({
    status: 403,
    description: 'Register user failed',
  })
  @Post('registerUserByEmailToken')
  async registerUserByEmailToken(
    @Response() res: any,
    @Body() body: RegisterInput,
  ): Promise<User> {
    return this.authTokenService.registerUserByEmailToken(res, body);
  }

  @ApiBody({ type: ResetTokenInput })
  @ApiOperation({
    summary: 'Reset token by email',
  })
  @ApiOkResponse({
    status: 200,
    type: string,
    description: 'Reset token successfully',
  })
  @ApiBadRequestResponse({
    status: 404,
    description: 'Reset token failed',
  })
  @Post('resetVerifyToken')
  async resetVerifyToken(@Response() res: any, @Body() body: ResetTokenInput): Promise<string> {
    return this.authTokenService.resetVerifyToken(res, body);
  }

  @ApiOperation({
    summary: 'Verify user by email',
  })
  @ApiOkResponse({
    status: 200,
    description: 'Verify user successfully',
  })
  @ApiBadRequestResponse({
    status: 404,
    description: 'Verify user failed',
  })
  @Get('verification/email/:token&email=:email')
  async verifyUserEmailToken(
    @Response() res: any,
    @Param('token') token: string,
    @Param('email') email: string,
  ): Promise<jwt.JwtPayload | string> {
    return this.authTokenService.verifyUserEmailToken(res, token, email);
  }

  @ApiBody({ type: ResetTokenInput })
  @ApiOperation({
    summary: 'Send token to email',
  })
  @ApiOkResponse({
    status: 200,
    type: string,
    description: 'Send token to email successfully',
  })
  @ApiBadRequestResponse({
    status: 403,
    description: 'Send token to email failed',
  })
  @Post('sendResetPasswordTokenToEmail')
  async sendResetPasswordTokenToEmail(
    @Response() res: any,
    @Body() body: ResetCodeInput,
  ): Promise<string> {
    return this.authTokenService.sendResetPasswordTokenToEmail(res, body);
  }

  @ApiOperation({
    summary: 'Check token to email',
  })
  @ApiOkResponse({
    status: 200,
    type: object,
    description: 'Check token successfully',
  })
  @ApiBadRequestResponse({
    status: 403,
    description: 'Check token failed',
  })
  @Get('checkResetPasswordToken/email/:token&email=:email')
  async checkResetPasswordToken(
    @Response() res: any,
    @Param('token') token: string,
    @Param('email') email: string,
  ): Promise<string | JwtPayload> {
    return this.authTokenService.checkResetPasswordToken(res, token, email);
  }
}
