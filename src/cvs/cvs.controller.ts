import { CvsService } from './cvs.service';
import CvsDto from './dto/create-cv.dto';
import { JwtService } from "@nestjs/jwt";
import { 
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  UnauthorizedException 
} from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('cvs')
export class CvsController {
  constructor(
    private readonly cvsService: CvsService,
    private readonly jwtService: JwtService
  ) {}

  @Post('')
  async createCv(
    @Body() createUserDto: CvsDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const token = req.cookies['jwt']
    const data = this.jwtService.decode(token);
    
    if (!data) {
      throw new UnauthorizedException('Unauthorized request');
    }

    console.log(data)
  
    return {test: true}
  }
}
