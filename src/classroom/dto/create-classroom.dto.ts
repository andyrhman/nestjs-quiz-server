import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { ClassLevel, ClassStatus, ClassType, ClassVisibility } from "../models/classroom.entity";

export class ClassroomCreateDto {
    @IsNotEmpty({ message: 'Classroom name is required' })
    name: string;

    @IsNotEmpty({ message: 'Classroom Info is required' })
    small_description: string;

    @IsNotEmpty({ message: 'Classroom Description is required' })
    long_description: string;

    @IsNotEmpty({ message: 'Study Estimation is required' })
    study_estimation: string;

    @IsOptional()
    picture: string;

    @IsEnum(ClassLevel, { message: 'Invalid Classroom Level' })
    @IsOptional()
    class_level: ClassLevel;

    @IsEnum(ClassType, { message: 'Invalid Classroom Type' })
    @IsOptional()
    class_type: ClassType;

    @IsEnum(ClassStatus, { message: 'Invalid Classroom Status' })
    @IsOptional()
    class_status: ClassStatus;

    @IsEnum(ClassVisibility, { message: 'Invalid Classroom Visibility' })
    @IsOptional()
    class_visibility: ClassVisibility;

    @IsOptional()
    @IsArray()
    @IsUUID('4', { each: true, message: 'Invalid Teacher ID' })
    teachers: string[];

    @IsOptional()
    @IsArray()
    @IsUUID('4', { each: true, message: 'Invalid Student ID' })
    students: string[];
}