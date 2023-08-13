import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import CreateProjectDto from './dto/create-project.dto';
import { Projects, ProjectsDocument } from './entities/projects.entity';
import { Model } from 'mongoose';


@Injectable()
export class ProjectsService {
  constructor(@InjectModel(Projects.name) private projectModel: Model<ProjectsDocument>) {}

  create(CreateProjectDto: CreateProjectDto) {
    return this.projectModel.create(CreateProjectDto);
  }
}
