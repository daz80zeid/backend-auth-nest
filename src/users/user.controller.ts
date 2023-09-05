import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from './auth/guards/auth.guard';
import { User as UserDecorator } from './decorators/user.decorator';
import { UpdateUserInput } from './input/update.user.input';
import { RegisterInput } from './input/register.input';
import { string } from "joi";

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Returns all user' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth('idToken')
  @ApiUnauthorizedResponse({ description: 'Unable to authorize in app' })
  @ApiOkResponse({
    status: 200,
    type: [User],
    description: 'Users found',
  })
  @ApiBadRequestResponse({
    status: 404,
    type: string,
    description: 'Users not found',
  })
  @Get('all')
  async findAll(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @ApiOperation({ summary: 'Returns all favorite courses for user' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth('idToken')
  @ApiUnauthorizedResponse({ description: 'Unable to authorize in app' })
  @ApiOkResponse({
    status: 200,
    type: User,
    description: 'Users found',
  })
  @ApiBadRequestResponse({
    status: 404,
    type: string,
    description: 'Users not found',
  })
  @Get('/getMe')
  async getMe(@UserDecorator() user: User): Promise<User> {
    return user;
  }

  @ApiBody({ type: RegisterInput })
  @ApiOperation({
    summary: 'Create new user',
  })
  @ApiOkResponse({
    status: 201,
    type: User,
    description: 'New User created',
  })
  @ApiBadRequestResponse({
    status: 400,
    type: string,
    description: 'Create new user failed',
  })
  @Post('/create')
  async createUser(@Body() user: RegisterInput): Promise<User> {
    return this.userService.create(user);
  }

  @ApiBody({ type: UpdateUserInput })
  @ApiOperation({
    summary: 'Update new user',
  })
  @UseGuards(AuthGuard)
  @ApiBearerAuth('idToken')
  @ApiUnauthorizedResponse({ description: 'Unable to authorize in app' })
  @ApiOkResponse({
    status: 201,
    type: User,
    description: 'User updated',
  })
  @ApiBadRequestResponse({
    status: 400,
    type: string,
    description: 'Update new user failed',
  })
  @Post('/update')
  async updateUser(@UserDecorator() user: User, @Body() input: UpdateUserInput): Promise<User> {
    return this.userService.update(user, input);
  }
}
