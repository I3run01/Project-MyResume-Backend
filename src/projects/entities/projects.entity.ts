import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProjectsDocument = Projects & Document;

@Schema()
class contentImage {
  @Prop()
  title: string

  @Prop()
  text: string

  @Prop()
  image: string
}


@Schema()
class ProjectsField {
  @Prop({required: true, unique: true})
  name: string

  @Prop()
  about: string

  @Prop()
  start: string

  @Prop()
  end:string | null

  @Prop()
  content: contentImage[]
}

@Schema()
export class Projects {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  groupName: string;

  @Prop()
  projects: ProjectsField

}

export const ProjectsSchema = SchemaFactory.createForClass(Projects);
