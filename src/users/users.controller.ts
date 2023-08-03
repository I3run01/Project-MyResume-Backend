import { UsersService } from './users.service';
import CreateUserDto from './dto/create-user.dto';
import { hash, compare } from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import {Response, Request} from 'express';
import { ClientProxy } from '@nestjs/microservices';
import axios from 'axios'
import { 
  Controller,
  Post,
  Get,
  Body,
  Res,
  Req,
  Param,
  Delete,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  Inject
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    @Inject('UTILS_SERVICE') private client: ClientProxy,
  ) {}

  @Post('signup')
  async signUp(
    @Body() createUserDto: CreateUserDto,
  ) {

    const { email, password } = createUserDto;

    if (!email || !password) throw new BadRequestException('Invalid credentials');

    let user = null

    try {
      user = await this.usersService.findByEmail(email);
    } catch {
      user = null
    }

    if (user?.status !== "Active" && user) {
        const confirmationCode:string = this.jwtService.sign({userId: user._id});
        
        const emailConfirmationLink = `https://iresume.cloud/emailConfirmation/${confirmationCode}`;

        let html = `<h1Confirm your email</h1>
                    <h2>Hello ${user.name ? user.name : ''}</h2>
                    <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
                    <a href=${emailConfirmationLink}> Click here</a>
                    </div>`

        this.client.emit('send-email', { email: user.email, subject: 'confirm the email', html: html });

        throw new UnauthorizedException("Pending Account. Please Verify Your Email!, a new link was sent to your email");
    }
    
    if (user) throw new BadRequestException('User already exists');

    createUserDto.password = await hash(createUserDto.password, 10);
    
    let newUser = await this.usersService.create(createUserDto);

    const confirmationCode:string = this.jwtService.sign({userId: newUser._id});

    const emailConfirmationLink = `https://iresume.cloud/emailConfirmation/${confirmationCode}`;

    let html = `<h1Confirm your email</h1>
                <h2>Hello ${createUserDto.name ? createUserDto.name : ''}</h2>
                <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
                <a href=${emailConfirmationLink}> Click here</a>
                </div>`

    this.client.emit('send-email', { email: createUserDto.email, subject: 'confirm the email', html: html });

    return newUser;
  }

  @Post('signin')
  async signIn(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({passthrough: true}) response: Response
  ) {
      if (!email || !password) throw new BadRequestException('Invalid credentials');

      let user = await this.usersService.findByEmail(email);
  
      if (!user) throw new NotFoundException('No user found');

      if (! await compare(password, user.password as string)) throw new UnauthorizedException('Invalid credentials');

      if (user.status !== "Active") {

          const confirmationCode:string = this.jwtService.sign({userId: user._id});
          
          const emailConfirmationLink = `https://iresume.cloud/emailConfirmation/${confirmationCode}`;

          let html = `<h1Confirm your email</h1>
          <h2>Hello ${user.name ? user.name : ''}</h2>
          <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
          <a href=${emailConfirmationLink}> Click here</a>
          </div>`

          this.client.emit('send-email', { email: user.email, subject: 'confirm the email', html: html });

          throw new UnauthorizedException("Pending Account. Please Verify Your Email!, a new link was sent in your email");
      }
      
      let token: string = this.jwtService.sign({userId: user._id});
      
      response.cookie('jwt', token, { sameSite: 'none', secure: true, httpOnly: true });

      user.password = null;

      return user;
  }

  @Get('/')
  async user(@Req() req: Request) {
        const token = req.cookies['jwt']

        let data = null;

        try {
            data = this.jwtService.decode(token);
        } catch (error) {
            throw new UnauthorizedException('Unauthorized request');
        }

        let userId = data.userId

        let user = await this.usersService.findById(userId)

        if (!user) {
            throw new BadRequestException("No user found");
        }

        if (user.status !== "Active") {
            const confirmationCode:string = this.jwtService.sign({userId: user._id});

            const emailConfirmationLink = `https://iresume.cloud/emailConfirmation/${confirmationCode}`;

            let html = `
              <h1Confirm your email</h1>
              <h2>Hello ${user.name ? user.name : ''}</h2>
              <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
              <a href=${emailConfirmationLink}> Click here</a>
              </div>
            `

            this.client.emit('send-email', { email: user.email, subject: 'confirm the email', html: html });

            throw new UnauthorizedException("Pending Account. Please Verify Your Email!. We sent a new link to your email");
        }

        user.password = null

        return user;
  }

  @Get('/confirm-email/:token')
  async emailConfirmation(
      @Param('token') token: string,
      @Res({passthrough: true}) response: Response
    ) {

      let data = null;

      try {
          data = this.jwtService.decode(token);
      } catch (error) {
        throw new UnauthorizedException('Unauthorized request');
      }

      let userId = data.userId
      
      let user = await this.usersService.findById(userId)    

      if (!user) throw new BadRequestException("No user found");

      await this.usersService.updateStatus(user.id, 'Active')

      let userToken: string = this.jwtService.sign({userId: user._id})

      response.cookie('jwt', userToken, { sameSite: 'none', secure: true, httpOnly: true })

      return user
  }

  @Get('/signout')
  async signout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt', { sameSite: 'none', secure: true, httpOnly: true });
    return { message: 'success' };
  }

  @Delete('/')
  async deleteUser(@Req() req: Request) {
    const token = await req.cookies['jwt']

    if (!token) throw new UnauthorizedException('Unauthorized request');
    
    let data = null;

    try {
        data = this.jwtService.decode(token);
    } catch (error) {
        throw new UnauthorizedException('Unauthorized request');
    }

    let userId = data.userId

    let status = await this.usersService.deleteOne(userId)

    return status
  }

  @Post('/google-signin')
  async googleSignin(
      @Res({ passthrough: true }) res: Response,
      @Body('googleToken') googleToken: string
    ) {

      if(!googleToken) throw new BadRequestException('No token sent');

      let response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${googleToken}`, {
        headers: {
            Authorization: `Bearer ${googleToken}`,
            Accept: 'application/json'
        }
      })
        
      let googleUser = response.data

      let user = null
      try {
        user = await this.usersService.findByEmail(googleUser.email);
      } catch {}

      if (!user) {
          let createUserDto: CreateUserDto = {
            name: googleUser.name,
            email: googleUser.email,
            password: await hash(String(Math.random()), 10),
            avatarImage: googleUser.picture,
            status: 'Active'
          }

          user = await this.usersService.create(createUserDto);
      }

      if(user.status != 'Active') {
          await this.usersService.updateStatus(user._id, 'Active');
      }

      let userToken: string = this.jwtService.sign({userId: user._id});

      res.cookie('jwt', userToken, { sameSite: 'none', secure: true, httpOnly: true });
      
      user.password = null;
      
      return user;
  }

  @Post('/forgot-password')
  async sendPasswordResetLink(@Body('email') email: string) {

      if (!email) throw new BadRequestException('Invalid credentials');

      const user = await this.usersService.findByEmail(email);

      if (!user) {
        throw new BadRequestException("No user found");
      }

      let resetPasswordToken: string = this.jwtService.sign({userId: user._id});

      const resetLink = `https://yournote.cloud/reset-password/${resetPasswordToken}`;

      let html = `<h1>Reset password</h1>
          <h2>Hello ${user.name ? user.name : ''}</h2>
          <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
          <a href=${resetLink}> Click here</a>
          </div>`

      this.client.emit('send-email', { email: user.email, subject: 'reset password', html: html });

      return { message: 'Password reset link sent to your email' };
  }

  @Post('/reset-password/:token')
  async updatePasswordWithToken(
    @Param('token') token: string,
    @Body('password') password: string,
    @Res({passthrough: true}) res: Response
  ) 
  {
    if(!password || !token) throw new BadRequestException('Invalid credentials');

    let hashPassword:string = await hash(String(password), 10)

    let data = null
    
    try {
      data = this.jwtService.decode(token);
    } catch (error) {
        throw new UnauthorizedException('Unauthorized request');
    }

    let userId = data.userId

    if (!data) throw new UnauthorizedException('Unauthorized request');

    let user = await this.usersService.findById(userId)

    if (!user) throw new BadRequestException("No user found");

    await this.usersService.updatePassword(userId, hashPassword)

    await this.usersService.updateStatus(userId, 'Active')
    
    let cookieToken: string = this.jwtService.sign({ userId: userId });
    
    res.cookie('jwt', cookieToken, { sameSite: 'none', secure: true, httpOnly: true })
    
    user.password = null

    return user;

  }
}
