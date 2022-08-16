import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student} from './student.model';
import { CreateStudentDto } from './studentCreate.sto';
import { UpdateStudentDto } from './studentUpdate.dto';
import { IStudent } from './student.interface';
@Injectable()
export class StudentService {
  constructor(
     @InjectModel(Student.name)
    private readonly student: Model<IStudent >,

  ) {}
  async createStudent(body: CreateStudentDto){
    const registerBody = {
            name: body.name,
            roleNumber: body.roleNumber,
            class: body.class,
            gender: body.gender,
            marks: body.marks,
          };
    const newStudent = await new this.student(registerBody);
    return newStudent.save();
 }
 async updateStudent(studentId: string, updateStudentDto: UpdateStudentDto): Promise<IStudent> {
     const existingStudent = await this.student.findByIdAndUpdate(studentId, updateStudentDto, { new: true });
    if (!existingStudent) {
      throw new NotFoundException(`Student #${studentId} not found`);
    }
    return existingStudent;
 }
 async getAllStudents(): Promise<IStudent[]> {
     const studentData = await this.student.find();
     if (!studentData || studentData.length == 0) {
         throw new NotFoundException('Students data not found!');
     }
     return studentData;
 }
 async getStudent(studentId: string): Promise<IStudent> {
    const existingStudent = await     this.student.findById(studentId).exec();
    if (!existingStudent) {
     throw new NotFoundException(`Student #${studentId} not found`);
    }
    return existingStudent;
 }
 async deleteStudent(studentId: string): Promise<IStudent> {
     const deletedStudent = await this.student.findByIdAndDelete(studentId);
    if (!deletedStudent) {
      throw new NotFoundException(`Student #${studentId} not found`);
    }
    return deletedStudent;
 }
}
