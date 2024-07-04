import { Test, TestingModule } from '@nestjs/testing';
import { ClassroomTokenController } from './classroom-token.controller';

describe('ClassroomTokenController', () => {
  let controller: ClassroomTokenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassroomTokenController],
    }).compile();

    controller = module.get<ClassroomTokenController>(ClassroomTokenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
