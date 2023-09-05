import { Global, Module } from '@nestjs/common';
import { AuthCodeService } from './auth.code.service';
import { AuthCodeController } from './auth.code.controller';
import { UserService } from '../../user.service';
import { AuthService } from '../auth.service';
import { MailerService } from '../mailer/mailer.custom.service';

@Global()
@Module({
  imports: [],
  providers: [
    AuthCodeService,
    UserService,
    AuthService,
    MailerService
  ],
  controllers: [AuthCodeController],
})
export class AuthCodeModule {}
