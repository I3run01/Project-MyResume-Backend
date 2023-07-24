import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CvsDocument = Cvs & Document;

@Schema({ timestamps: true, _id: false })
export class PersonalData {
  @Prop()
  fullName: string;

  @Prop()
  birthday: string;

  @Prop()
  location: string;

  @Prop()
  phone: string;
}

@Schema({ timestamps: true, _id: false })
export class Colleges {
  @Prop()
  trainningArea: string;

  @Prop()
  collegeName: string;

  @Prop()
  graduationYear: string;
}

@Schema({ timestamps: true, _id: false })
export class Language {
  @Prop()
  language: string;

  @Prop()
  level: string;
}

@Schema({ timestamps: true, _id: false })
export class SocialMedia {
  @Prop()
  title: string;

  @Prop()
  link: string;
}

@Schema()
export class Cvs {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  cvTitle: string;

  @Prop()
  resume: string;

  @Prop()
  objectives: string;

  @Prop()
  personalDatas: PersonalData;

  @Prop()
  colleges: Colleges[];

  @Prop()
  languages: Language[];

  @Prop()
  abilities: string[];

  @Prop()
  socialMedias: SocialMedia[];

  @Prop()
  experinces: object[];

}

export const CvsSchema = SchemaFactory.createForClass(Cvs);
