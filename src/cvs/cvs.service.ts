import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import CreateCvDto from './dto/create-cv.dto';
import { Cvs, CvsDocument } from './entities/cv.entity';
import { Model } from 'mongoose';


@Injectable()
export class CvsService {
  constructor(@InjectModel(Cvs.name) private cvModel: Model<CvsDocument>) {}

  create(createCvDto: CreateCvDto) {
    return this.cvModel.create(createCvDto);
  }
}
