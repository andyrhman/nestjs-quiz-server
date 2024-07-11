import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";
import { ClassroomService } from "src/classroom/classroom.service";
import { fakerID_ID as faker } from "@faker-js/faker";
import { ClassLevel, ClassType, ClassStatus, ClassVisibility, Classroom } from "src/classroom/models/classroom.entity";
import { UserService } from "src/user/user.service";

const bootstrap = async () => {
    const app = await NestFactory.createApplicationContext(AppModule);

    const classroomService = app.get(ClassroomService);
    const userService = app.get(UserService);

    // Fetch users from the database
    const allUsers = await userService.find({});

    for (let i = 0; i < 10; i++) {
        // * Randomly select 3 students and 1 teacher from the list of users
        const students = faker.helpers.arrayElements(allUsers, 3);
        const teacher = faker.helpers.arrayElement(allUsers);

        const classroom = new Classroom();
        classroom.name = faker.commerce.department();
        classroom.small_description = faker.lorem.sentence();
        classroom.study_estimation = `${faker.number.int({ min: 1, max: 12 })} hours`;
        classroom.long_description = faker.lorem.paragraphs(2);
        classroom.class_level = ClassLevel.beginner; // or another level if you prefer
        classroom.class_type = i < 5 ? ClassType.free : ClassType.paid;
        classroom.class_status = ClassStatus.active;
        classroom.class_visibility = ClassVisibility.private;
        classroom.class_deadline = faker.date.future();
        classroom.picture = faker.image.url();
        classroom.price = i < 5 ? 0 : faker.number.int({ min: 1000000, max: 5000000 });
        classroom.students = students;
        classroom.teachers = [teacher];

        await classroomService.create(classroom);
    }

    process.exit();
};
bootstrap();
