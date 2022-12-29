import { Test, TestingModule } from '@nestjs/testing';
import { OnlineGateway } from './online.gateway';

describe('OnlineGateway', () => {
  let gateway: OnlineGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OnlineGateway],
    }).compile();

    gateway = module.get<OnlineGateway>(OnlineGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
