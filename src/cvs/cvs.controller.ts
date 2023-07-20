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

  @Delete(':cvId')
  async deleteCv(
    @Req() req: Request,
    @Param('cvId') cvId: string,
    @Res({passthrough: true}) res: Response
  ) {
    const token = req.cookies['jwt']
    const data = this.jwtService.decode(token);

    if (!data || !data['userId']) {
      throw new UnauthorizedException('Unauthorized request');
    }
    
    const userId = data['userId']
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
    const token = req.cookies['jwt']
    const data = this.jwtService.decode(token);

    if (!data || !data['userId']) {
      throw new UnauthorizedException('Unauthorized request');
    }
    
    const userId = data['userId']
    const cv = await this.cvsService.findById(cvId)

    if (!cv || cv["userId"] !== userId) {
      throw new UnauthorizedException('Unauthorized request');
    }

    return cv
  }

  @Post('/name/:cvId')
  async changeName(
    @Req() req: Request,
    @Param('cvId') cvId: string,
    @Res({passthrough: true}) res: Response,
    @Body('name') name: string
  ) {
    const token = req.cookies['jwt']
    const data = this.jwtService.decode(token);
    
    if (!data || !data['userId']) {
      throw new UnauthorizedException('Unauthorized request');
    }
    
    const userId = data['userId']

    console.log(cvId)

    let cv = await this.cvsService.findById(cvId)

    if (!cv || cv["userId"] !== userId) {
      throw new UnauthorizedException('Unauthorized request');
    }

    cv = await this.cvsService.updateCvName(cvId, name)
    
    return cv
  }

  @Post('/resume/:cvId')
  async changeResume(
    @Req() req: Request,
    @Param('cvId') cvId: string,
    @Res({passthrough: true}) res: Response,
    @Body('resume') resume: string
  ) {
    const token = req.cookies['jwt']
    const data = this.jwtService.decode(token);
    
    if (!data || !data['userId']) {
      throw new UnauthorizedException('Unauthorized request');
    }
    
    const userId = data['userId']

    console.log(cvId)

    let cv = await this.cvsService.findById(cvId)

    if (!cv || cv["userId"] !== userId) {
      throw new UnauthorizedException('Unauthorized request');
    }

    cv = await this.cvsService.updateResume(cvId, resume)
    
    return cv
  }

  @Post('/personalDatas/:cvId')
  async changePersonalDatas(
    @Req() req: Request,
    @Param('cvId') cvId: string,
    @Res({passthrough: true}) res: Response,
    @Body('personalDatas') personalDatas: string
  ) {
    const token = req.cookies['jwt']
    const data = this.jwtService.decode(token);
    
    if (!data || !data['userId']) {
      throw new UnauthorizedException('Unauthorized request');
    }
    
    const userId = data['userId']

    let cv = await this.cvsService.findById(cvId)

    if (!cv || cv["userId"] !== userId) {
      throw new UnauthorizedException('Unauthorized request');
    }

    cv = await this.cvsService.updatePersonalDatas(cvId, personalDatas)
    
    return cv
  }

  @Post('/colleges/:cvId')
  async changeColleges(
    @Req() req: Request,
    @Param('cvId') cvId: string,
    @Res({passthrough: true}) res: Response,
    @Body('colleges') colleges: string
  ) {
    const token = req.cookies['jwt']
    const data = this.jwtService.decode(token);
    
    if (!data || !data['userId']) {
      throw new UnauthorizedException('Unauthorized request');
    }
    
    const userId = data['userId']

    let cv = await this.cvsService.findById(cvId)

    if (!cv || cv["userId"] !== userId) {
      throw new UnauthorizedException('Unauthorized request');
    }

    cv = await this.cvsService.updateColleges(cvId, colleges)
    
    return cv
  }

  @Post('/languages/:cvId')
  async changeLanguages(
    @Req() req: Request,
    @Param('cvId') cvId: string,
    @Res({passthrough: true}) res: Response,
    @Body('languages') languages: string
  ) {
    const token = req.cookies['jwt']
    const data = this.jwtService.decode(token);
    
    if (!data || !data['userId']) {
      throw new UnauthorizedException('Unauthorized request');
    }
    
    const userId = data['userId']

    let cv = await this.cvsService.findById(cvId)

    if (!cv || cv["userId"] !== userId) {
      throw new UnauthorizedException('Unauthorized request');
    }

    cv = await this.cvsService.updateLanguages(cvId, languages)
    
    return cv
  }

  @Post('/abilities/:cvId')
  async changeAbilities(
    @Req() req: Request,
    @Param('cvId') cvId: string,
    @Res({passthrough: true}) res: Response,
    @Body('abilities') abilities: string
  ) {
    const token = req.cookies['jwt']
    const data = this.jwtService.decode(token);
    
    if (!data || !data['userId']) {
      throw new UnauthorizedException('Unauthorized request');
    }
    
    const userId = data['userId']

    let cv = await this.cvsService.findById(cvId)

    if (!cv || cv["userId"] !== userId) {
      throw new UnauthorizedException('Unauthorized request');
    }

    cv = await this.cvsService.updateAbilities(cvId, abilities)
    
    return cv
  }

  @Post('/socialMedias/:cvId')
  async changeSocialMedias(
    @Req() req: Request,
    @Param('cvId') cvId: string,
    @Res({passthrough: true}) res: Response,
    @Body('socialMedias') socialMedias: string
  ) {
    const token = req.cookies['jwt']
    const data = this.jwtService.decode(token);
    
    if (!data || !data['userId']) {
      throw new UnauthorizedException('Unauthorized request');
    }
    
    const userId = data['userId']

    let cv = await this.cvsService.findById(cvId)

    if (!cv || cv["userId"] !== userId) {
      throw new UnauthorizedException('Unauthorized request');
    }

    cv = await this.cvsService.updateSocialMedias(cvId, socialMedias)
    
    return cv
  }
}
