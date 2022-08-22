import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from './student.model';
import { CreateStudentDto } from './studentCreate.sto';
import { UpdateStudentDto } from './studentUpdate.dto';
import { IStudent } from './student.interface';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name)
    private readonly student: Model<IStudent>,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async createStudent(body: CreateStudentDto) {
    const existingUser = await this.findByEmail(body.email);

    if (existingUser)
      throw new HttpException(
        'An account with that email already exists!',
        HttpStatus.CONFLICT,
      );

    const hashedPassword = await this.hashPassword(body.password);

    const registerBody = {
      name: body.name,
      roleNumber: body.roleNumber,
      class: body.class,
      gender: body.gender,
      marks: body.marks,
      email: body.email,
      password: hashedPassword,
    };
    const newStudent = await new this.student(registerBody);
    return newStudent.save();
  }
  async updateStudent(
    studentId: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<IStudent> {
    const existingStudent = await this.student.findByIdAndUpdate(
      studentId,
      updateStudentDto,
      { new: true },
    );
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
    const existingStudent = await this.student.findById(studentId).exec();
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
  async findByEmail(email: string): Promise<IStudent> {
    return this.student.findOne({ email }).exec();
  }
  async doesPasswordMatch(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async validateUser(email: string, password: string): Promise<IStudent> {
    const user = await this.findByEmail(email);
    const doesUserExist = !!user;

    if (!doesUserExist) {
      throw new HttpException('User not exist..!', HttpStatus.BAD_REQUEST);
    }

    const doesPasswordMatch = await this.doesPasswordMatch(
      password,
      user.password,
    );

    if (!doesPasswordMatch) {
      throw new HttpException(
        'Password not matched..!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }

  async login(existingUser): Promise<{ token: string }> {
    const { email, password } = existingUser;
    const user = await this.validateUser(email, password);

    if (!user)
      throw new HttpException('Credentials invalid!', HttpStatus.UNAUTHORIZED);
    const jwt = await this.createJWTToken(user);

    console.log('user LoggedIn successfully', user);
    return { token: jwt };
  }

  async createJWTToken(payload): Promise<string> {
    const jwt = await this.jwtService.signAsync({
      user: payload,
    });
    return jwt;
  }

  //jwt expiry generator
  async verifyJwt(jwt: string): Promise<{ exp: number }> {
    try {
      const [exp] = await this.jwtService.verifyAsync(jwt);
      return { exp };
    } catch (error) {
      throw new HttpException('Invalid JWT', HttpStatus.UNAUTHORIZED);
    }
  }
}
