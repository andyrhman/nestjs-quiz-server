import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ClassLevel, ClassStatus, ClassType, ClassVisibility } from "../models/classroom.entity";

export class ClassroomCreateDto {
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
}