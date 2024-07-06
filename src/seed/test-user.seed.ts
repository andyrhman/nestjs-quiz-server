import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";
import { UserService } from "src/user/user.service";
import * as argon2 from 'argon2';

const bootstrap = async () => {
    const app = await NestFactory.createApplicationContext(AppModule);
    
    const userService = app.get(UserService);

    const password = await argon2.hash("123123");

    let addCount = 1;

    for (let i = 0; i < 5; i++) {
        await userService.create({
            fullname: `test${addCount}`,
            username: `test${addCount}`,
            email: `test${addCount}@mail.com`,
            password,
        });
        addCount++
    }

    process.exit()
}
bootstrap();

// ! YOU NEED TO RUN THIS SEEDER INSIDE DOCKER CONTAINER OR IT WON'T WORK!
// * docker exec -it <container id use (docker ps) to check> bash
// * modify package.json script setting
// * npm run seed:ambassadors 