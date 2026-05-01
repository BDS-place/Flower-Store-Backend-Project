import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryAddressesController } from './delivery-addresses.controller';

describe('DeliveryAddressesController', () => {
  let controller: DeliveryAddressesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryAddressesController],
    }).compile();

    controller = module.get<DeliveryAddressesController>(DeliveryAddressesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
