export class OrderDto {
  id: string;
  name: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  status: OrderStatus;
  clientId: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PAYED = 'PAYED',
  CANCELLED = 'CANCELLED',
}

export class CreateOrderDto {
  name: string;
  price: number;
  clientId: string;
}
