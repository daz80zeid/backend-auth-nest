import { env } from 'process';
import { MailerService as MailerServiceLib } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailerService {
  protected fromEmail = env.FROM_EMAIL;

  constructor(private readonly mailerService: MailerServiceLib) {}

  async sendEmailToken(email, url): Promise<any> {
    const mail = this.mailerService.sendMail({
      to: email,
      from: this.fromEmail, // sender address
      subject: 'Testing Nest MailerModule ', // Subject line
      text: 'code cf1a3f828287', // plaintext body
      html: '<b>welcome</b> link: ' + url,
    });

    return mail;
  }

  async sendEmailCode(email, code): Promise<any> {
    const mail = this.mailerService.sendMail({
      to: email,
      from: this.fromEmail, // sender address
      subject: 'Testing Nest MailerModule ', // Subject line
      text: 'code cf1a3f828287', // plaintext body
      html: '<b>welcome</b> code: ' + code, // HTML body content
    });

    return mail;
  }
}
