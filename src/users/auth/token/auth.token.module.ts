import { Global, Module } from '@nestjs/common';
import { AuthTokenService } from './auth.token.service';
import { AuthTokenController } from './auth.token.controller';
import { UserService } from '../../user.service';
import { AuthService } from '../auth.service';
import {MailerService} from "../mailer/mailer.custom.service";

@Global()
@Module({
  imports: [],
  providers: [AuthTokenService, UserService, AuthService, MailerService],
  controllers: [AuthTokenController],
})
export class AuthTokenModule {}
