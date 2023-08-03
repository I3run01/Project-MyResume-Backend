import { Module } from '@nestjs/common';
import { CvsController } from './cvs.controller';

@Module({
  imports: [],
  controllers: [CvsController],
  providers: []
})

export class CvsModule {}
