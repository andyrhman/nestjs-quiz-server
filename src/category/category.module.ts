import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CommonModule } from 'src/common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './models/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    CommonModule
  ],
  providers: [CategoryService],
  controllers: [CategoryController]
})
export class CategoryModule {}
