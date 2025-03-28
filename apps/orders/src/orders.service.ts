import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateOrderDto, OrderDto } from './order.dto';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('ORDERS_SERVICE') // Injetando o cliente kafka
    private readonly kafkaClient: ClientKafka,
  ) {}

  async getOrders(): Promise<OrderDto[]> {
    const orders = await this.prisma.order.findMany();
    return orders.map((order) => ({
      ...order,
      status: order.status as unknown as OrderDto['status'],
    }));
  }

  async createOrder(data: CreateOrderDto): Promise<OrderDto> {
    const order = await this.prisma.order.create({
      data: {
        ...data,
        status: 'PENDING',
      },
    });

    // Emite um evento para o tópico 'order.created' no Kafka com os dados do pedido criado
    // e aguarda a conclusão da operação usando lastValueFrom para converter o Observable em Promise
    await lastValueFrom(this.kafkaClient.emit('orders', order));

    // Retorna o pedido criado com o status atualizado
    return {
      ...order,
      status: order.status as unknown as OrderDto['status'],
    };
  }
}
