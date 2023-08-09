import { ProjectsService } from './projects.service';
import projectsDto from './dto/create-project.dto';
import { JwtService } from "@nestjs/jwt";
import { 
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  Res,
  UnauthorizedException,
  BadRequestException
} from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly jwtService: JwtService
  ) {}


  private verifyAndGetUserId(req: Request): string {
    const token = req.cookies['jwt'];
    const data = this.jwtService.decode(token);

    if (!data || !data['userId']) {
      throw new UnauthorizedException('Unauthorized request');
    }

    return data['userId'];
  }

  @Post('')
  async createProject(
    @Req() req: Request,
    @Res({passthrough: true}) res: Response
  ) {
    const userId = this.verifyAndGetUserId(req);

    const newProject: projectsDto = {
      name: 'name',
      userId: userId,
    }
    
    let response = await this.projectsService.create(newProject)

    console.log(response)

    return response
  }

}
