import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { categoryValidation } from './validation/category.validation';
import { JoiValidationPipe } from 'src/common/validation.pipe';
import { isUUID } from 'class-validator';

@Controller('category')
export class CategoryController {
    constructor(
        private categoryService: CategoryService
    ) {}

    @Post()
    async create(
        @Body(new JoiValidationPipe(categoryValidation)) body: any
    ){
        const existingCat = await this.categoryService.findOne({name: body.name});

        if (existingCat) {
            throw new BadRequestException("Category already exists")
        }

        return this.categoryService.create({
            name: body.name
        })
    }

    @Get(':id')
    async get(@Param('id') id: string){
        if (!isUUID(id)) {
            throw new BadRequestException('Invalid UUID format');
        }
        return this.categoryService.findOne({id})
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() body: any
    ){
        const existingCat = await this.categoryService.findOne({name: body.name});

        if (existingCat) {
            throw new BadRequestException("Category already exists")
        }

        const update = await this.categoryService.update(id, {
            name: body.name
        });

        return this.categoryService.findOne({id});
    }

    @Delete(':id')
    async delete(
        @Param('id') id: string,
    ){
        return this.categoryService.delete(id);
    }

}
