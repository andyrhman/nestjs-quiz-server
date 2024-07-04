import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";
import { PermissionService } from "src/permission/permission.service";
import { RoleService } from "src/role/role.service";

const bootstrap = async () => {
    const app = await NestFactory.createApplicationContext(AppModule);
    
    const roleService = app.get(RoleService);
    const permissionService = app.get(PermissionService);

    const perms = [
        'view_users', 'edit_users',
        'view_student_info', 'edit_student_info',
        'view_classroom', 'edit_classroom',
        'view_classroom_code', 'edit_classroom_code',
        'view_classroom_session', 'edit_classroom_session',
        'view_learning_material', 'edit_learning_material',
        'view_learning_progress', 'edit _learning_progress',
        'view_class_discussion', 'edit_class_discussion',
        'view_class_discussion_comment', 'edit_class_discussion_comment',
        'view_class_discussion_likes', 'edit_class_discussion_likes',
        'view_assignment', 'edit_assignment',
        'view_question', 'edit_question',
        'view_chat', 'edit_chat',
    ];

    let permissions = [];

    // Create and save permissions
    for (let perm of perms) {
        const permission = await permissionService.create({ name: perm });
        permissions.push(permission);
    }

    // Define roles with specific permissions
    const adminPermissions = permissions; // Admin gets all permissions

    const teacherPermissions = permissions.filter(perm => ![
        'view_classroom', 'edit_classroom',
        'view_classroom_code', 'edit_classroom_code',
        'view_classroom_session', 'edit_classroom_session',
        'view_learning_material', 'edit_learning_material',
        'view_learning_progress', 'edit _learning_progress',
        'view_class_discussion', 'edit_class_discussion',
        'view_class_discussion_comment', 'edit_class_discussion_comment',
        'view_class_discussion_likes', 'edit_class_discussion_likes',
        'view_assignment', 'edit_assignment',
        'view_question', 'edit_question',
        'view_chat', 'edit_chat',
    ].includes(perm.name)); // Teacher gets specific permissions

    const studentPermissions = permissions.filter(perm => ![
        'view_student_info', 'edit_student_info',
        'view_classroom',
        'view_classroom_code',
        'view_classroom_session',
        'view_learning_material',
        'view_learning_progress',
        'view_class_discussion',
        'view_class_discussion_comment',
        'view_class_discussion_likes',
        'view_assignment',
        'view_question',
        'view_chat',
    ].includes(perm.name)); // Student gets specific permissions

    // Create and save roles
    await roleService.create({
        name: 'Admin',
        permissions: adminPermissions
    });

    await roleService.create({
        name: 'Teacher',
        permissions: teacherPermissions
    });

    await roleService.create({
        name: 'Student',
        permissions: studentPermissions
    });

    process.exit()
}
bootstrap();

// ! YOU NEED TO RUN THIS SEEDER INSIDE DOCKER CONTAINER OR IT WON'T WORK!
// * docker exec -it <container id use (docker ps) to check> bash
// * modify package.json script setting
// * npm run seed:ambassadors 