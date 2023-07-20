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
    @Req() req: Request,
    @Res({passthrough: true}) res: Response
  ) {
    const token = req.cookies['jwt']
    const data = this.jwtService.decode(token);

    if (!data || !data['userId']) {
      throw new UnauthorizedException('Unauthorized request');
    }
    
    let userId = data['userId']
    
    if (!data) {
      throw new UnauthorizedException('Unauthorized request');
    }

    const newCv: CvsDto = {
      name: 'new name',
      userId: userId
    }

    let response = await this.cvsService.create(newCv)

    return response
  }

  @Get('')
  async getUserCvs(
    @Req() req: Request,
    @Res({passthrough: true}) res: Response
  ) {
    const token = req.cookies['jwt']
    const data = this.jwtService.decode(token);

    if (!data || !data['userId']) {
      throw new UnauthorizedException('Unauthorized request');
    }
    
    let userId = data['userId']
    
    if (!data) {
      throw new UnauthorizedException('Unauthorized request');
    }

    let cvs = await this.cvsService.findByUserId(userId)

    return cvs
  }
  
}
