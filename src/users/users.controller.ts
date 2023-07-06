import { UsersService } from './users.service';
import CreateUserDto from './dto/create-user.dto';
import { hash, compare } from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import {Response, Request} from 'express';
import { mailServices } from './../utils/functions'
import { 
  Controller,
  Post,
  Body,
  Res,
  Req,
  Delete,
  HttpException,
  HttpStatus,
  NotFoundException,
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
    @Body() createUserDto: CreateUserDto,
    @Req() request: Request
  ) {

    const { email, password } = createUserDto;

    if (!email || !password) throw new BadRequestException('Invalid credentials');

    let user = await this.usersService.findByEmail(email);

    if (user?.status !== "Active" && user) {
        const confirmationCode:string = this.jwtService.sign({userId: user.id});
        const emailConfirmationLink = `https://yournote.cloud/emailConfirmation/${confirmationCode}`;
        mailServices.sendConfirmationEmail(user.email, emailConfirmationLink, user?.name);

        throw new UnauthorizedException("Pending Account. Please Verify Your Email!, a new link was sent to your email");
    }
    
    if (user) throw new BadRequestException('User already exists');

    createUserDto.password = await hash(createUserDto.password, 10);
    let newUser = await this.usersService.create(createUserDto);

    const confirmationCode:string = this.jwtService.sign({userId: newUser.id});
    const emailConfirmationLink = `https://yournote.cloud/emailConfirmation/${confirmationCode}`;
    mailServices.sendConfirmationEmail(createUserDto.email, emailConfirmationLink, createUserDto?.name);

    return newUser;
  }

  @Post('signin')
  async signIn(
    @Body() createUserDto: CreateUserDto,
    @Req() request: Request,
    @Res({passthrough: true}) response
  ) {
      const { email, password } = createUserDto;

      if (!email || !password) throw new BadRequestException('Invalid credentials');

      let user = await this.usersService.findByEmail(email);
  
      if (!user) throw new NotFoundException('No user found');

      if (! await compare(password, user.password as string)) throw new UnauthorizedException('Invalid credentials');

      if (user.status !== "Active") {
          const confirmationCode:string = this.jwtService.sign({userId: user.id});
          console.log(confirmationCode);
          const emailConfirmationLink = `https://yournote.cloud/emailConfirmation/${confirmationCode}`;
          mailServices.sendConfirmationEmail(user.email, emailConfirmationLink, user.name);
          throw new UnauthorizedException("Pending Account. Please Verify Your Email!, a new link was sent in your email");
      }
      
      let token: string = this.jwtService.sign({userId: user.id});
      
      response.cookie('jwt', token, { sameSite: 'none', secure: true, httpOnly: true });

      user.password = '';

      return user;
  }

}
