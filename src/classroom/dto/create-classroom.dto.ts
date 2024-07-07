import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { ClassStatus, ClassType } from "../models/classroom.entity";

export class ClassroomCreateDto {
    @IsNotEmpty({ message: 'Classroom name is required' })
    name: string;

    @IsNotEmpty({ message: 'Description is required' })
    description: string;

    @IsEnum(ClassType, { message: 'Class type must be either Free or Paid' })
    @IsOptional()
    class_type: ClassType;

    @IsEnum(ClassStatus, { message: 'Class status must be either Active or Closed' })
    @IsOptional()
    class_status: ClassStatus;
}