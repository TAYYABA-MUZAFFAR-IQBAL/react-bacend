import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";
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
}