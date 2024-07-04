import {
    Controller,
    Get,
    Body,
    Put,
    Delete,
    Param,
    NotFoundException,
    Post
}
    from '@nestjs/common';
import { RoleService } from './role.service';
import { HasPermission } from 'src/permission/decorator/permission.decorator';
import { RoleDTO } from './dto/role.dto';

@Controller('roles')
export class RoleController {
    constructor(
        private roleService: RoleService
    ) { }

    @Get()
    @HasPermission('roles')
    async all() {
        return this.roleService.all();
    }

    @Post()
    @HasPermission('roles')
    async create(
        @Body() body: RoleDTO
    ) {
        /*
            [1, 2]

            [
                {id: 1}, {id: 2}
            ]
        */
        return this.roleService.create({
            name: body.name,
            permissions: body.permissions.map(id => ({ id }))
        });
    }

    @Get(':id')
    @HasPermission('roles')
    async get(@Param('id') id: number) {

        const search = await this.roleService.findOne({ id }, ['permissions']);

        if (!search) {
            throw new NotFoundException('Role not found');
        }

        return search;
    }

    @Put(':id')
    @HasPermission('roles')
    async update(
        @Param('id') id: string,
        @Body() body: RoleDTO
    ) {
        await this.roleService.update(id, { name: body.name });

        const role = await this.roleService.findOne({ id });

        return this.roleService.create({
            ...role,
            permissions: body.permissions.map(id => ({ id }))
        });
    }

    @Delete(':id')
    @HasPermission('roles')
    async delete(
        @Param('id') id: string,
    ) {
        await this.roleService.delete(id);

        return {
            message: "Role deleted sucessfully"
        };
    }
}