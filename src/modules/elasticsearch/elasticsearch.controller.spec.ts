import { Test, TestingModule } from '@nestjs/testing';
import { ElasticsearchController } from './elasticsearch.controller';

describe('ElasticsearchController', () => {
  let controller: ElasticsearchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ElasticsearchController],
    }).compile();

    controller = module.get<ElasticsearchController>(ElasticsearchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
