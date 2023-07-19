import { Module } from '@nestjs/common';
import { CvsService } from './cvs.service';
import { CvsController } from './cvs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cvs, CvsSchema } from './entities/cv.entity'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cvs.name, schema: CvsSchema }]),
  ],
  controllers: [CvsController],
  providers: [CvsService]
})

export class CvsModule {}
