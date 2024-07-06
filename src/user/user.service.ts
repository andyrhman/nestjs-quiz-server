import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { User } from './models/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService extends AbstractService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {
        super(userRepository)
    }
    // Create user with generating student_id
    async create(data): Promise<User> {
        const year = new Date().getFullYear().toString().slice(-2); // Get last two digits of the current year
        const fullYear = new Date().getFullYear().toString();
        const userCount = await this.userRepository.createQueryBuilder('user')
            .where('TO_CHAR(user.created_at, \'YYYY\') = :year', { year: fullYear })
            .getCount(); // Get the count of users registered in the current year
        const increment = (userCount + 1).toString().padStart(6, '0'); // Increment and pad with leading zeros
        data.student_id = `${year}${increment}`; // Generate student ID
        
        return super.create(data);
    }
    
    async findUsersRegister(search: string): Promise<User[]> { // Change the return type to User[]
        return this.userRepository
        .createQueryBuilder('user')
        .where('user.username ILIKE :search OR user.email ILIKE :search', { search: `%${search}%` })
        .getMany();
    }
}
