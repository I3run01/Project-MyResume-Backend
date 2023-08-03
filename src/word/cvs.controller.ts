import {Controller,Post,Req,Res} from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('cvs')
export class CvsController {
  constructor() {}

  @Post('')
  async createCv(@Req() req: Request,@Res({passthrough: true}) res: Response  ) {
  
  }

}
