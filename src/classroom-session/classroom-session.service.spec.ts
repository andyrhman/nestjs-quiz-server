import { Test, TestingModule } from '@nestjs/testing';
import { ClassroomSessionService } from './classroom-session.service';

describe('ClassroomSessionService', () => {
  let service: ClassroomSessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassroomSessionService],
    }).compile();

    service = module.get<ClassroomSessionService>(ClassroomSessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
