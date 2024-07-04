import { ArrayMinSize, ArrayNotEmpty, IsInt, IsNotEmpty, IsString } from "class-validator";

export class RoleDTO{
    @IsNotEmpty({message: "Name is required"})
    @IsString({message: "Name must be a string"})
    name?: string;

    @ArrayNotEmpty({ message: 'Permissions is required' })
    @ArrayMinSize(1, { message: 'Permissions should have at least 1 item' })
    @IsInt({each: true, message: 'Permissions must be a number'})
    permissions?: string[]
}