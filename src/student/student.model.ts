import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
// import mongoose, { Document, Schema } from 'mongoose';

@Schema()
export class Student {
  @Prop()
  name: string;
  @Prop()
  email: string;
  @Prop()
  password: string;
}
export const StudentSchema = SchemaFactory.createForClass(Student);
