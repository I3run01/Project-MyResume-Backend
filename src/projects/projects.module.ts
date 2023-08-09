import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Projects, ProjectsSchema } from './entities/projects.entity'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Projects.name, schema: ProjectsSchema }]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService]
})

export class ProjectModule {}
