import { Injectable } from '@nestjs/common';
import CreateCvDto from './dto/create-cv.dto';


@Injectable()
export class CvsService {
  create(createCvDto: CreateCvDto) {
    return 'This action adds a new cv';
  }

  findAll() {
    return `This action returns all cvs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cv`;
  }

  remove(id: number) {
    return `This action removes a #${id} cv`;
  }
}
