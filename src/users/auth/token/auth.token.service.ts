import { Body, HttpStatus, Injectable, Response } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserService } from '../../user.service';
import { User } from '../../entities/user.entity';
import { env } from 'process';
import { ResetCodeInput } from '../../input/reset.code.input';
import { RegisterInput } from '../../input/register.input';
import { VerifyToken } from '../../entities/verify.token.entity';
import { ResetPasswordToken } from '../../entities/reset.password.token.entity';
import { ResetTokenInput } from '../../input/reset.token.input';
import { AuthService } from '../auth.service';
import { MailerService } from '../mailer/mailer.custom.service';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class AuthTokenService {
  constructor(
    private readonly usersService: UserService,
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

  async registerUserByEmailToken(
    @Response() res: any,
    @Body() body: RegisterInput,
  ): Promise<User> {
    const statusValidate = await this.authService.validateUserDataRegister(
      body,
    );

    if (statusValidate !== 'Validated') {
      return res.status(HttpStatus.FORBIDDEN).json(statusValidate);
    }

    const user = await this.usersService.create(body);
    const token = await this.authService.createToken(user.id);
    const url =
      (env.FRONTEND_URL ?? 'http://127.0.0.1:' + env.APP_PORT) +
      '/auth/verification/email/' +
      token.token +
      '&email=' +
      body.email;
    const mail = await this.mailerService.sendEmailToken(body.email, url);

    if (!mail) {
      return res.status(HttpStatus.OK).json('Error send token');
    } else if (user) {
      body.password = undefined;
    }

    await this.createTokenSubject(user, 'Verify', token.token);

    return res.status(HttpStatus.OK).json(user);
  }

  async resetVerifyToken(@Response() res: any, @Body() body: ResetCodeInput): Promise<string> {
    const user = await User.findOne({ where: { email: body.email } });

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json('User not found');
    } else if (user.verify) {
      return res.status(HttpStatus.NOT_FOUND).json('Verify code not found or user already verified');
    }

    const newToken = await this.authService.createToken(user.id);
    const url =
      (env.FRONTEND_URL ?? 'http://127.0.0.1:' + env.APP_PORT) +
      '/auth/verification/email/' +
      newToken.token +
      '&email=' +
      body.email;
    const mail = await this.mailerService.sendEmailToken(user.email, url);

    if (!mail) {
      return res.status(HttpStatus.NOT_FOUND).json('Send email failed');
    }

    await this.createOrResetVerifyToken(user, newToken.token);

    return res.status(HttpStatus.OK).json('Reset code successfully');
  }

  async verifyUserEmailToken(
    @Response() res: any,
    token: string,
    email: string,
  ): Promise<jwt.JwtPayload | string> {
    const decodeToken = this.checkToken(token, email);
    if (typeof decodeToken !== 'object') {
      return res.status(HttpStatus.NOT_FOUND).json(decodeToken);
    }

    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json('User not found');
    } else if (!user.verify) {
      await this.verifyAndDeleteOldVerifyToken(user);
      return res.status(HttpStatus.OK).json('User verify');
    }

    return res.status(HttpStatus.NOT_FOUND).json('User already verified');
  }

  async sendResetPasswordTokenToEmail(
    @Response() res: any,
    @Body() body: ResetTokenInput,
  ): Promise<string> {
    const user = await User.findOne({ where: { email: body.email } });

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json('User not found');
    }

    const newToken = await this.authService.createToken(user.id);
    const url =
      (env.FRONTEND_URL ?? 'http://127.0.0.1:' + env.APP_PORT) +
      '/auth/checkResetPasswordToken/email/' +
      newToken.token +
      '&email=' +
      user.email;
    const mail = await this.mailerService.sendEmailToken(user.email, url);

    if (!mail) {
      return res.status(HttpStatus.NOT_FOUND).json('Send email failed');
    }

    await this.createOrResetResetPasswordToken(user, newToken.token);

    return res.status(HttpStatus.OK).json('Send email with code successfully');
  }

  async checkResetPasswordToken(@Response() res: any, token, email): Promise<string | JwtPayload> {
    const decodeToken = this.checkToken(token, email);

    if (typeof decodeToken !== 'object') {
      return res.status(HttpStatus.NOT_FOUND).json(decodeToken);
    }

    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json('User not found');
    } else if (user.verify) {
      return res.status(HttpStatus.NOT_FOUND).json('User already verified');
    }

    await this.verifyAndDeleteOldResetPasswordToken(user);

    return res
      .status(HttpStatus.OK)
      .json(await this.authService.createToken(user.id));
  }

  async createTokenSubject(
    user: User,
    typeToken: string,
    token: string,
  ): Promise<ResetPasswordToken | VerifyToken | false> {
    let tokenSubject = null;

    switch (typeToken) {
      case 'Reset password':
        tokenSubject = new ResetPasswordToken();
        break;
      case 'Verify':
        tokenSubject = new VerifyToken();
        break;
      default:
        return false;
    }

    const today = new Date();

    tokenSubject.token = token;
    tokenSubject.id_user = user.id;
    tokenSubject.expire_at = today;
    tokenSubject.save();

    return tokenSubject;
  }

  async createOrResetVerifyToken(user: User, newToken: string): Promise<ResetPasswordToken | VerifyToken | false> {
    const verifyToken = await VerifyToken.findOne({
      where: { id_user: user.id },
    });

    if (verifyToken) {
      verifyToken.token = newToken;
      await verifyToken.save();

      return verifyToken;
    }

    return await this.createTokenSubject(user, 'Verify', newToken);
  }

  async checkToken(token, email): Promise<jwt.JwtPayload | string> {
    let decodeToken: jwt.JwtPayload | string;

    try {
      decodeToken = this.decodeToken(token);
    } catch (error) {
      return 'Invalid token';
    }

    if (typeof decodeToken !== 'object' || !decodeToken) {
      return 'Invalid token';
    } else if (email !== decodeToken.email) {
      return 'Email does not match the token';
    }

    const statusCheckToken = await this.checkLifetimeToken(decodeToken);

    if (statusCheckToken !== 'Сode is correct') {
      return statusCheckToken;
    }

    return decodeToken;
  }

  decodeToken(token: string): JwtPayload | string {
    return jwt.decode(token);
  }

  async checkLifetimeToken(decodeToken): Promise<string> {
    const today = new Date();

    if (Number(decodeToken.iat) > Number(today.setHours(today.getHours() + 1).toString())) {
      return 'Lifetime expired';
    }

    return 'Сode is correct';
  }

  async verifyAndDeleteOldVerifyToken(user: User): Promise<User> {
    const userToken = await VerifyToken.findOne({
      where: { id_user: user.id },
    });

    user.verify = true;

    await user.save();
    await userToken.remove();

    return user;
  }

  async createOrResetResetPasswordToken(user: User, newToken: string): Promise<ResetPasswordToken | VerifyToken | false> {
    const resetPasswordToken = await ResetPasswordToken.findOne({
      where: { id_user: user.id },
    });

    if (resetPasswordToken) {
      resetPasswordToken.token = newToken;
      await resetPasswordToken.save();

      return resetPasswordToken;
    }

    return await this.createTokenSubject(user, 'Reset password', newToken);
  }

  async verifyAndDeleteOldResetPasswordToken(user: User): Promise<User> {
    const resetPasswordToken = await ResetPasswordToken.findOne({
      where: { id_user: user.id },
    });

    if (!user.verify) {
      const verifyToken = await VerifyToken.findOne({
        where: { id_user: user.id },
      });

      user.verify = true;
      await verifyToken.remove();
      await user.save();
    }

    await resetPasswordToken.remove();

    return user;
  }
}
