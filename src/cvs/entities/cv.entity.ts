import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CvsDocument = Cvs & Document;

@Schema()
export class Cvs {
  @Prop()
  userId: string;

  @Prop()
  name: String;

  @Prop({
    type: {
      fullName: String,
      birthday: String,
      location: String,
      number: String,
    }
  })
  personalDatas: Record<string, any>;

  @Prop()
  resume: string;

  @Prop([{
    trainingArea: String,
    collegeName: String,
    graduationYear: String,
  }])
  colleges: Record<string, any>[];

  @Prop([{
    language: String,
    level: String,
  }])
  languages: Record<string, any>[];

  @Prop([String])
  abilities: string[];

  @Prop([{
    title: String,
    link: String,
  }])
  socialMedias: Record<string, any>[];
}

export const CvsSchema = SchemaFactory.createForClass(Cvs);
