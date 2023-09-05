import { Body, HttpStatus, Injectable, Response } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserService } from '../user.service';
import { User } from '../entities/user.entity';
import { env } from 'process';
import { ResetPasswordByEmailInput } from '../input/reset.password.by.email.input';
import { LoginInput } from '../input/login.input';
import { JwtPayload } from 'jsonwebtoken';

type OutputToken = {
  expires_in: number;
  token: string;
  userId: { id: string };
};
type OutputMessage = { message: string };

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UserService) {}

  async loginUser(@Response() res: any, @Body() body: LoginInput): Promise<OutputMessage | OutputToken> {
    if (!(body && body.email && body.password)) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'Email and password are required!' });
    }

    const user = await this.usersService.getUserByEmail(body.email);

    if (!user) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'User does not exist!' });
    }

    const passwordSimilarity = await this.usersService.compareHash(
      body.password,
      user.password,
    );

    const failedMessage = { message: '' };

    if (user.verify && passwordSimilarity == true) {
      return res.status(HttpStatus.OK).json(await this.createToken(user.id));
    } else if (passwordSimilarity == false) {
      failedMessage.message = 'Email or password wrong';
    } else {
      failedMessage.message = "User don't verify";
    }

    return res.status(HttpStatus.FORBIDDEN).json(failedMessage);
  }

  async resetPassword(
    @Response() res: any,
    user: User,
    @Body() body: ResetPasswordByEmailInput,
  ): Promise<OutputMessage> {
    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found' });
    }

    user.password = await this.usersService.getHash(body.password);

    await user.save();

    return res.status(HttpStatus.OK).json({ message: 'Reset password successfully' });
  }

  decodeToken(token: string): JwtPayload | string {
    return jwt.decode(token);
  }

  async validateUserDataRegister(body): Promise<string> {
    if (!(body && body.email && body.password)) {
      return 'Email and password are required!';
    }

    const user = await this.usersService.getUserByEmail(body.email);

    if (user) {
      return 'Email exists';
    }

    return 'Validated';
  }

  async createToken(id: string): Promise<OutputToken> {
    const expiresIn = Number(env.JWT_EXPIRES_IN);
    const userId = { id };
    const token = jwt.sign(userId, env.SECRET_KEY_JWT, {
      expiresIn: expiresIn,
      audience: 'urn:foo',
    });

    return { expires_in: expiresIn, token, userId };
  }
}
