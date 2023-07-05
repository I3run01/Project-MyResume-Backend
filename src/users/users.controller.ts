import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { hash, compare as bcryptCompare } from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import {Response, Request} from 'express';
import { 
  Controller,
  Post,
  Body,
  Res,
  Get,
  Req,
  Delete,
  UnauthorizedException,
  BadRequestException
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService
  ) {}

  @Post('signup')
  async signUp(
    @Body('email') email:string,
    @Body('password') password:string,
    @Res({passthrough: true}) response: Response
  ) {

    let user = await this.usersService.findByEmail(email)

    if(user) {
      throw new BadRequestException('user already exists')
    }

    const createUserDto:CreateUserDto = {
      name: null,
      email,
      password: await hash(password, 10),
      avatarImage: null
    }

    user = await this.usersService.create(createUserDto);

    delete user.password

    if(user.password) user.password = null

    const jwt = await this.jwtService.signAsync({id: user._id});

    response.cookie('jwt', jwt, {httpOnly: true});

    return user
  }

  @Post('signin')
  async signIn(
    @Body('email') email:string,
    @Body('password') password:string,
    @Res({passthrough: true}) response: Response
  ) {
    const user = await this.usersService.findByEmail(email)

    if(!user) {
      throw new BadRequestException('invaid credentials')
    }

    if(! await bcryptCompare(password, user.password)) {
      throw new BadRequestException('invalid credentials')
    }

    const jwt = await this.jwtService.signAsync({id: user.id});

    response.cookie('jwt', jwt, {httpOnly: true});

    delete user.password

    if (user.password) user.password = null

    return user
  }



}
