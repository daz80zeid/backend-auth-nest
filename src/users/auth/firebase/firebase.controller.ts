import { Body, Controller, Post, Response } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LoginGoogleInput } from '../../input/login.google.input';
import { object } from 'joi';

type OutputToken = {
  expires_in: number;
  token: string;
  userId: { id: string };
};

@ApiTags('Auth Firebase')
@Controller('auth')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @ApiBody({ type: LoginGoogleInput })
  @ApiOperation({
    summary: 'Auth with Google',
  })
  @ApiOkResponse({
    status: 200,
    type: object,
    description: 'Auth with Google successfully',
  })
  @ApiBadRequestResponse({
    status: 403,
    description: 'Auth with Google failed',
  })
  @Post('google')
  async authGoogle(
    @Response() res: any,
    @Body() body: LoginGoogleInput,
  ): Promise<OutputToken> {
    return await this.firebaseService.auth(res, body.token);
  }

  @ApiBody({ type: LoginGoogleInput })
  @ApiOperation({
    summary: 'Auth with Phone',
  })
  @ApiOkResponse({
    status: 200,
    type: object,
    description: 'Auth with Phone successfully',
  })
  @ApiBadRequestResponse({
    status: 403,
    description: 'Auth with Phone failed',
  })
  @Post('phone')
  async authPhone(
    @Response() res: any,
    @Body() body: LoginGoogleInput,
  ): Promise<OutputToken> {
    return await this.firebaseService.auth(res, body.token);
  }
}
