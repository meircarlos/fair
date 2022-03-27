import { Test, TestingModule } from '@nestjs/testing';
import { RemindersResolver } from './reminders.resolver';
import { RemindersService } from './reminders.service';

describe('RemindersResolver', () => {
  let resolver: RemindersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RemindersResolver, RemindersService],
    }).compile();

    resolver = module.get<RemindersResolver>(RemindersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
