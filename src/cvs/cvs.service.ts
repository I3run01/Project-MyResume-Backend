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

  async findByUserId(userId: string): Promise<CvsDocument[]> {
    const cvs = await this.cvModel.find({ userId: userId }).exec();
    if (!cvs) {
      throw new NotFoundException(`CVs with userId ${userId} not found`);
    }
    return cvs;
  }

  async findById(cvId: string): Promise<CvsDocument> {
    const cv = await this.cvModel.findById(cvId).exec();
    if (!cv) {
      throw new NotFoundException(`CV with id ${cvId} not found`);
    }
    return cv;
  }

  async delete(cvId: string): Promise<any> {
    const cv = await this.cvModel.findByIdAndRemove(cvId).exec();
    if (!cv) {
      throw new NotFoundException(`CV with id ${cvId} not found`);
    }
    return cv;
  }
}
