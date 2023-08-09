import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProjectsDocument = Projects & Document;

@Schema()
export class Projects {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  projectName: string;

}

export const ProjectsSchema = SchemaFactory.createForClass(Projects);
