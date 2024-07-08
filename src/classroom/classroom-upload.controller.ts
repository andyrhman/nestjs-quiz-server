import { Controller, Get, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from "express";
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('classroom')
export class UploadController {

    @Post('upload')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './uploads/class_image',
            filename(_, file, callback) {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return callback(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    }))
    uploadFile(@UploadedFile() file) {
        console.log(file);
        return {
            url: `http://localhost:8000/api/classroom/uploads/class_image/${file.filename}`
        };
    }

    @Get('uploads/class_image/:filename')
    async getImage(
        @Param('filename') filename,
        @Res() res: Response
    ) {
        res.sendFile(filename, { root: 'uploads/class_image/' });
    }

    @Get('uploads/:filename')
    async getDefaultImage(
        @Param('filename') filename,
        @Res() res: Response
    ) {
        res.sendFile(filename, { root: 'uploads/' });
    }
}