import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from './prisma/prisma.service';
import { OrderStatus } from './order.dto';

describe('OrdersService', () => {
  let service: OrdersService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    order: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOrders', () => {
    it('should return an array of orders', async () => {
      const mockOrders = [
        {
          id: '1',
          name: 'Order 1',
          price: 100,
          status: 'PENDING',
          clientId: 'client1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.order.findMany.mockResolvedValue(mockOrders);

      const result = await service.getOrders();
      expect(result).toEqual(mockOrders);
      expect(mockPrismaService.order.findMany).toHaveBeenCalled();
    });
  });

  describe('createOrder', () => {
    it('should create and return a new order', async () => {
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

      mockPrismaService.order.create.mockResolvedValue(mockCreatedOrder);

      const result = await service.createOrder(orderData);
      expect(result).toEqual(mockCreatedOrder);
      expect(mockPrismaService.order.create).toHaveBeenCalledWith({
        data: {
          ...orderData,
          status: 'PENDING',
        },
      });
    });
  });
});
