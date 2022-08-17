import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentDto } from './studentCreate.sto';
export class UpdateStudentDto extends PartialType(CreateStudentDto) {}
