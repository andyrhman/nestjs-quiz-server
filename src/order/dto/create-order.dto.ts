import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderDto {
    @IsArray()
    @IsNotEmpty()
    classrooms: {
        class_id: string;
    }[];
}
