import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  InvalidUserError,
  UserAlreadyExistError,
  WrongPasswordError,
} from 'src/utils/error';
import { getErrorCodeAndMessage } from 'src/utils/helper';
import { compare } from 'bcryptjs';
import { SignInDto } from './dto/signin.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { Public } from 'src/auth/decorators/public';
import { CurrentUser } from 'src/auth/decorators/currentUser';
import { User } from './entities/user.entity';

@SkipThrottle()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    try {
      const { email } = createUserDto;

      const user = await this.usersService.findOne({ email });

      if (user) {
        throw new UserAlreadyExistError();
      }

      const newUser = await this.usersService.create(createUserDto);

      return newUser;
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Public()
  @Post('signin')
  async signin(@Body() signInDto: SignInDto) {
    try {
      const { email, password } = signInDto;

      const user = await this.usersService.findOne({ email });

      if (!user) {
        throw new InvalidUserError();
      }

      const isValidPassword = await compare(password, user.password);

      if (!isValidPassword) {
        throw new WrongPasswordError();
      }

      const jwtToken = this.usersService.generateToken({
        id: user.id,
        email: user.email,
      });

      const response = {
        user,
        accessToken: jwtToken.token,
        expiresIn: jwtToken.expiresIn,
      };

      return response;
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('me')
  async me(@CurrentUser() currentUser: User) {
    try {
      const user = await this.usersService.findOne({ id: currentUser.id });

      if (!user) {
        throw new InvalidUserError();
      }

      return user;
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
