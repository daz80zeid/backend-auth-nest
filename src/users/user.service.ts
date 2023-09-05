import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { RegisterInput } from './input/register.input';
import { UpdateUserInput } from './input/update.user.input';

@Injectable()
export class UserService {
  private saltRounds = 10;

  async getAllUsers(): Promise<User[]> {
    return User.find();
  }

  async create(userCreate: RegisterInput): Promise<User> {
    const user = new User();

    user.password = await this.getHash(userCreate.password);
    user.last_name = userCreate.last_name;
    user.first_name = userCreate.first_name;
    user.email = userCreate.email;
    await user.save();

    return user;
  }

  async update(user: User, input: UpdateUserInput): Promise<User> {
    user.last_name = input.last_name;
    user.first_name = input.first_name;

    if (input.phoneNumber) {
      user.phoneNumber = input.phoneNumber;
    }

    await user.save();

    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    return User.findOne({
      where: {
        email: email,
      },
    });
  }

  async getUserById(id: string): Promise<User> {
    return User.findOne({
      where: {
        id: id,
      },
    });
  }

  async getHash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async compareHash(
    password: string | undefined,
    hash: string | undefined,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
