import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RegisterInput } from '../../input/register.input';
import { object, string } from 'joi';
import {
  Body,
  Controller,
  Post,
  Response
} from '@nestjs/common';
import { ResetCodeInput } from '../../input/reset.code.input';
import { UserVerifyEmailCodeInput } from '../../input/user.verify.email.code.input';
import { CheckCodeInput } from '../../input/check.code.input';
import { AuthCodeService } from './auth.code.service';
import { User } from '../../entities/user.entity';

type OutputToken = {
  expires_in: number;
  token: string;
  userId: { id: string };
};

@ApiTags('Auth Code')
@Controller('auth')
export class AuthCodeController {
  constructor(private readonly authCodeService: AuthCodeService) {}

  @ApiBody({ type: RegisterInput })
  @ApiOperation({
    summary: 'Register by email',
  })
  @ApiOkResponse({
    status: 200,
    type: string,
    description: 'Register user successfully',
  })
  @ApiBadRequestResponse({
    status: 403,
    description: 'Register user failed',
  })
  @Post('registerUserByEmailCode')
  async registerUserByEmailCode(
    @Response() res: any,
    @Body() body: RegisterInput,
  ): Promise<string | User> {
    return this.authCodeService.registerUserByEmailCode(res, body);
  }

  @ApiBody({ type: ResetCodeInput })
  @ApiOperation({
    summary: 'Reset code by email',
  })
  @ApiOkResponse({
    status: 200,
    type: string,
    description: 'Reset code successfully',
  })
  @ApiBadRequestResponse({
    status: 404,
    description: 'Reset code failed',
  })
  @Post('resetVerifyCode')
  async resetVerifyCode(
    @Response() res: any,
    @Body() body: ResetCodeInput
  ): Promise<string> {
    return this.authCodeService.resetVerifyCode(res, body);
  }

  @ApiBody({ type: UserVerifyEmailCodeInput })
  @ApiOperation({
    summary: 'Verify user by email',
  })
  @ApiOkResponse({
    status: 200,
    type: string,
    description: 'Verify user successfully',
  })
  @ApiBadRequestResponse({
    status: 404,
    description: 'Verify user failed',
  })
  @Post('verifyUserEmailCode')
  async verifyUserEmailCode(
    @Response() res: any,
    @Body() body: UserVerifyEmailCodeInput,
  ): Promise<string> {
    return this.authCodeService.verifyUserEmailCode(res, body);
  }

  @ApiBody({ type: ResetCodeInput })
  @ApiOperation({
    summary: 'Send code to email',
  })
  @ApiOkResponse({
    status: 200,
    type: string,
    description: 'Send code to email successfully',
  })
  @ApiBadRequestResponse({
    status: 403,
    description: 'Send code to email failed',
  })
  @Post('sendResetPasswordCodeToEmail')
  async sendResetPasswordCodeToEmail(
    @Response() res: any,
    @Body() body: ResetCodeInput,
  ): Promise<string> {
    return this.authCodeService.sendResetPasswordCodeToEmail(res, body);
  }

  @ApiBody({ type: CheckCodeInput })
  @ApiOperation({
    summary: 'Check code to email',
  })
  @ApiOkResponse({
    status: 200,
    type: object,
    description: 'Check code successfully',
  })
  @ApiBadRequestResponse({
    status: 403,
    description: 'Check code failed',
  })
  @Post('checkResetPasswordCode')
  async checkResetPasswordCode(
    @Response() res: any,
    @Body() body: CheckCodeInput,
  ): Promise<string | OutputToken> {
    return this.authCodeService.checkResetPasswordCode(res, body);
  }
}
