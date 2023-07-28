import { CvsService } from './cvs.service';
import CvsDto from './dto/create-cv.dto';
import { JwtService } from "@nestjs/jwt";
import { 
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  Res,
  UnauthorizedException,
  BadRequestException
} from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('cvs')
export class CvsController {
  constructor(
    private readonly cvsService: CvsService,
    private readonly jwtService: JwtService
  ) {}


  private verifyAndGetUserId(req: Request): string {
    const token = req.cookies['jwt'];
    const data = this.jwtService.decode(token);

    if (!data || !data['userId']) {
      throw new UnauthorizedException('Unauthorized request');
    }

    return data['userId'];
  }

  @Post('')
  async createCv(
    @Req() req: Request,
    @Res({passthrough: true}) res: Response
  ) {
    const userId = this.verifyAndGetUserId(req);

    const newCv: CvsDto = {
      name: 'new name',
      userId: userId,
      resume: '',
      objectives: '',
      cvTitle: '',
      personalDatas: {
        birthday: '',
        fullName: '',
        location: '',
        phone: ''
      },
      colleges:[],
      languages:[],
      abilities:[],
      socialMedias:[],
      experinces:[]
    }
    
    let response = await this.cvsService.create(newCv)

    console.log(response)

    return response
  }

  @Get('')
  async getUserCvs(
    @Req() req: Request,
    @Res({passthrough: true}) res: Response
  ) {
    const userId = this.verifyAndGetUserId(req);

    let cvs = await this.cvsService.findByUserId(userId)

    return cvs
  }

  @Delete(':cvId')
  async deleteCv(
    @Req() req: Request,
    @Param('cvId') cvId: string,
    @Res({passthrough: true}) res: Response
  ) {
    const userId = this.verifyAndGetUserId(req);

    const cv = await this.cvsService.findById(cvId)

    if (!cv || cv["userId"] !== userId) {
      throw new UnauthorizedException('Unauthorized request');
    }

    await this.cvsService.delete(cvId)
    return {message: "CV deleted successfully."}
  }

  @Get(':cvId')
  async retrieveSpecificCv(
    @Req() req: Request,
    @Param('cvId') cvId: string,
    @Res({passthrough: true}) res: Response
  ) {
    const userId = this.verifyAndGetUserId(req);

    const cv = await this.cvsService.findById(cvId)

    if (!cv || cv["userId"] !== userId) {
      throw new UnauthorizedException('Unauthorized request');
    }

    return cv
  }

  @Post('/:field/:cvId')
  async changeField(
    @Req() req: Request,
    @Param('cvId') cvId: string,
    @Param('field') field: string,
    @Body('body') body: any
  ) {
    const userId = this.verifyAndGetUserId(req);

    if (body === null || body === undefined) {
      throw new BadRequestException('body can not be null or undefiend');
    }
    
    let cv = await this.cvsService.findById(cvId)

    if (!cv || cv["userId"] !== userId) {
      throw new UnauthorizedException('Unauthorized request');
    }

    cv = await this.cvsService.updateField(cvId, field, body);

    return cv;
  }

  @Get('/:field/:cvId')
  async retrieveSpecicField(
    @Req() req: Request,
    @Param('cvId') cvId: string,
    @Param('field') field: string,
  ) {
    const userId = this.verifyAndGetUserId(req);

    let cv = await this.cvsService.findById(cvId)

    console.log(cv)

    if (!cv || cv["userId"] !== userId) {
      throw new UnauthorizedException('Unauthorized request');
    }

    let cvFild = cv[field]

    return cvFild;
  }
}
