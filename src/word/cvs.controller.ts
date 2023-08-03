import { Controller, Post, Body } from '@nestjs/common';

@Controller('word')
export class WordController {
  constructor() {}

  @Post('')
  async createCv(@Body() body: Object) {

    console.log(body)
  }
}
