import { Prop } from '@nestjs/mongoose';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';
export class CreateStudentDto {
  @IsNotEmpty()
  readonly name: string;
  @IsNotEmpty()
  readonly roleNumber: number;

  @IsNotEmpty()
  readonly class: number;
  @IsNotEmpty()
  readonly gender: string;

  @IsNotEmpty()
  readonly marks: number;

  @IsEmail()
  @Prop({ required: true, unique: true })
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
}
