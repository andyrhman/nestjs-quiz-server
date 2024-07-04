import { Test, TestingModule } from '@nestjs/testing';
import { ClassroomTokenService } from './classroom-token.service';

describe('ClassroomTokenService', () => {
  let service: ClassroomTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassroomTokenService],
    }).compile();

    service = module.get<ClassroomTokenService>(ClassroomTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
