import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { ClassLevel, ClassStatus, ClassType, ClassVisibility } from "../models/classroom.entity";

export class ClassroomUpdateDto {
    @IsOptional()
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    small_description: string;

    @IsString()
    @IsOptional()
    long_description: string;

    @IsString()
    @IsOptional()
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
}