import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentController } from './student.controller';
import { Student, StudentSchema } from './student.model';
import { StudentService } from './student.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: 'secret',
        acessTokenExp: { expiresIn: '1m' },
      }),
    }),
  ],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService],
})
export class StudentModule {}
