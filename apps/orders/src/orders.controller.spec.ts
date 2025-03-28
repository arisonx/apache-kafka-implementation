import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderStatus } from './order.dto';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  const mockOrdersService = {
    getOrders: jest.fn(),
    createOrder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getOrders', () => {
    it('should return an array of orders', async () => {
      const mockOrders = [
        {
          id: '1',
          name: 'Order 1',
          price: 100,
          status: OrderStatus.PENDING,
          clientId: 'client1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockOrdersService.getOrders.mockResolvedValue(mockOrders);

      const result = await controller.getOrders();
      expect(result).toBe(mockOrders);
      expect(mockOrdersService.getOrders).toHaveBeenCalled();
    });
  });

  describe('createOrder', () => {
    it('should create a new order', async () => {
      const orderData = {
        name: 'New Order',
        price: 150,
        status: OrderStatus.PENDING,
        clientId: 'client1',
      };

      const mockCreatedOrder = {
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...orderData,
      };

      mockOrdersService.createOrder.mockResolvedValue(mockCreatedOrder);

      const result = await controller.createOrder(orderData);
      expect(result).toBe(mockCreatedOrder);
      expect(mockOrdersService.createOrder).toHaveBeenCalledWith(orderData);
    });
  });
});
