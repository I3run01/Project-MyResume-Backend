import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CvsDocument = Cvs & Document;

@Schema()
export class Cvs {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  personalDatas: object[];

  @Prop()
  resume: string;

  @Prop()
  colleges: object[];

  @Prop()
  languages: object[];

  @Prop()
  abilities: object[];

  @Prop()
  socialMedias: object[];
}

export const CvsSchema = SchemaFactory.createForClass(Cvs);
