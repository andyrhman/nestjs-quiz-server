import { Test, TestingModule } from '@nestjs/testing';
import { ClassroomSessionController } from './classroom-session.controller';

describe('ClassroomSessionController', () => {
  let controller: ClassroomSessionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassroomSessionController],
    }).compile();

    controller = module.get<ClassroomSessionController>(ClassroomSessionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
