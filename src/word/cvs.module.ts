import { Module } from '@nestjs/common';
import { WordController } from './cvs.controller';

@Module({
  imports: [],
  controllers: [WordController],
  providers: []
})

export class WordModule {}
