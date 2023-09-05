import { Body, HttpStatus, Injectable, Response } from '@nestjs/common';
import { UserService } from '../../user.service';
import { RegisterInput } from '../../input/register.input';
import { User } from '../../entities/user.entity';
import { UserVerifyEmailCodeInput } from '../../input/user.verify.email.code.input';
import { ResetCodeInput } from '../../input/reset.code.input';
import { VerifyCode } from '../../entities/verify.code.entity';
import { ResetPasswordCode } from '../../entities/reset.password.code.entity';
import { CheckCodeInput } from '../../input/check.code.input';
import { AuthService } from '../auth.service';
import { MailerService } from '../mailer/mailer.custom.service';

type OutputToken = {
  expires_in: number;
  token: string;
  userId: { id: string };
};

@Injectable()
export class AuthCodeService {
  constructor(
    private readonly usersService: UserService,
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

  async registerUserByEmailCode(
    @Response() res: any,
    @Body() body: RegisterInput,
  ): Promise<string | User> {
    const statusValidate = await this.authService.validateUserDataRegister(body);

    if (statusValidate !== 'Validated') {
      return res.status(HttpStatus.FORBIDDEN).json(statusValidate);
    }

    const code = await this.createCode(6);
    const mail = await this.mailerService.sendEmailCode(body.email, code);

    if (!mail) {
      return res.status(HttpStatus.FORBIDDEN).json('Error send mail');
    }

    const user = await this.usersService.create(body);

    await this.createCodeSubject(
      user,
      'Verify',
      code
    );

    return res.status(HttpStatus.OK).json(user);
  }

  async resetVerifyCode(@Response() res: any, @Body() body: ResetCodeInput): Promise<string> {
    const user = await User.findOne({ where: { email: body.email } });

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json('User not found');
    }

    const verifyCode = user.verify_code;

    if (!verifyCode && user.verify) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json('Verify code not found or user already verified');
    }

    const newCode = await this.createCode(6);
    const mail = await this.mailerService.sendEmailCode(user.email, newCode);

    if (!mail) {
      return res.status(HttpStatus.NOT_FOUND).json('Send email failed');
    }

    this.createOrResetVerifyCode(
      user,
      verifyCode,
      newCode
    );

    return res.status(HttpStatus.OK).json('Reset code successfully');
  }

  async verifyUserEmailCode(
    @Response() res: any,
    @Body() body: UserVerifyEmailCodeInput,
  ): Promise<string> {
    const user = await User.findOne({ where: { email: body.email } });

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json('User not found');
    } else if (user.verify) {
      return res.status(HttpStatus.NOT_FOUND).json('User already verified');
    }

    const verifyCode = user.verify_code;
    const statusCheckCode = await this.checkCode(body.code, verifyCode);

    if (statusCheckCode === 'Сode is correct') {
      await this.verifyAndDeleteOldVerifyCode(user, verifyCode);

      return res.status(HttpStatus.OK).json('User verify');
    }

    return res.status(HttpStatus.NOT_FOUND).json(statusCheckCode);
  }

  async sendResetPasswordCodeToEmail(
    @Response() res: any,
    @Body() body: ResetCodeInput,
  ): Promise<string> {
    const user = await User.findOne({ where: { email: body.email } });

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json('User not found');
    }

    const newCode = await this.createCode(6);
    const mail = await this.mailerService.sendEmailCode(user.email, newCode);

    if (!mail) {
      return res.status(HttpStatus.NOT_FOUND).json('Send email failed');
    }

    await this.createOrResetResetPasswordCode(
      user,
      user.reset_password_code,
      newCode,
    );

    return res.status(HttpStatus.OK).json('Send email with code successfully');
  }

  async checkResetPasswordCode(@Response() res: any, body: CheckCodeInput): Promise<string | OutputToken> {
    const user = await this.usersService.getUserByEmail(body.email);

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json('User not found');
    }

    const resetPasswordCode = user.reset_password_code;
    const statusCheckCode = await this.checkCode(body.code, resetPasswordCode);

    if (statusCheckCode !== 'Сode is correct') {
      return res.status(HttpStatus.NOT_FOUND).json(statusCheckCode);
    }

    this.verifyAndDeleteOldResetPasswordCode(user, resetPasswordCode.id);

    return res
      .status(HttpStatus.OK)
      .json(await this.authService.createToken(user.id));
  }

  async verifyAndDeleteOldResetPasswordCode(
    user: User,
    resetPasswordCodeId: string,
  ): Promise<User> {
    const resetPasswordCode = await ResetPasswordCode.findOne({
      where: { id: resetPasswordCodeId },
    });

    if (user.verify_code) {
      const verifyCode = await VerifyCode.findOne({
        where: { id: user.verify_code.id },
      });
      await verifyCode.remove();
    }

    user.verify = true;
    user.verify_code = null;
    user.reset_password_code = null;

    await user.save();
    await resetPasswordCode.remove();

    return user;
  }

  async createOrResetResetPasswordCode(
    user: User,
    resetPasswordCode: ResetPasswordCode,
    newCode: string,
  ): Promise<ResetPasswordCode | VerifyCode | false> {
    const today = new Date();

    if (resetPasswordCode) {
      resetPasswordCode.code = newCode;
      resetPasswordCode.expire_at = today
        .setHours(today.getHours() + 1)
        .toString();
      resetPasswordCode.save();

      return resetPasswordCode;
    }

    return await this.createCodeSubject(
      user,
      'Reset password',
      newCode
    );
  }

  async verifyAndDeleteOldVerifyCode(user: User, verifyCode: VerifyCode): Promise<User> {
    const usersCode = await VerifyCode.findOne({
      where: { id: verifyCode.id },
    });

    user.verify = true;
    user.verify_code = null;

    await user.save();
    usersCode.remove();

    return user;
  }

  async createOrResetVerifyCode(
    user: User,
    verifyCode: VerifyCode,
    newCode: string,
  ): Promise<ResetPasswordCode | VerifyCode | false> {
    const today = await new Date();

    if (verifyCode) {
      verifyCode.code = newCode;
      verifyCode.expire_at = today.setHours(today.getHours() + 1).toString();
      verifyCode.save();

      return verifyCode;
    }

    return this.createCodeSubject(
      user,
      'Verify',
      newCode
    );
  }

  async createCodeSubject(
    user: User,
    typeCode: string,
    code: string,
  ): Promise<ResetPasswordCode | VerifyCode | false> {
    let codeSubject = null;

    switch (typeCode) {
      case 'Reset password':
        codeSubject = new ResetPasswordCode();
        break;
      case 'Verify':
        codeSubject = new VerifyCode();
        break;
      default:
        return false;
    }

    const today = new Date();

    codeSubject.code = code;
    codeSubject.user = user;
    codeSubject.expire_at = today.setHours(today.getHours() + 1).toString();
    codeSubject.save();

    return codeSubject;
  }

  async createCode(length): Promise<string> {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  async checkCode(code: string, codeSubject): Promise<string> {
    const today = new Date();

    if (codeSubject.code == code) {
      if (Number(codeSubject.expire_at) > Number(today.getTime().toString())) {
        return 'Сode is correct';
      }

      return 'Lifetime expired';
    }

    return "Code doesn't match";
  }
}
