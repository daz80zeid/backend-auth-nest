import { Global, Module } from '@nestjs/common';
import { env } from 'process';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { MailerService } from './mailer.custom.service';
import { AppConfigModule } from '../../../config/app/app.config.module';
import { MailerModule as MailerModuleLib } from '@nestjs-modules/mailer';

@Global()
@Module({
  imports: [
    MailerModuleLib.forRoot({
      transport: env.TRANSPORT_MAIL,
      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    AppConfigModule,
  ],
  providers: [MailerService],
  controllers: [],
})
export class MailerModule {}
