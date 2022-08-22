import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
// import mongoose, { Document, Schema } from 'mongoose';

@Schema()
export class Student {
  @Prop()
  name: string;
  @Prop()
  roleNumber: number;
  @Prop()
  class: number;
  @Prop()
  gender: string;
  @Prop()
  marks: number;
  @Prop()
  email: string;
  @Prop()
  password: string;
}
export const StudentSchema = SchemaFactory.createForClass(Student);
