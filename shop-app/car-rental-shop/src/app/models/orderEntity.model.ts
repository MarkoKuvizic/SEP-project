// src/app/models/order.model.ts

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PAID = 'PAID',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

export interface OrderItem {
  id: string;
  carId: string;
  carModel: string;
  carBrand: string;
  dailyRate: number;
  rentalDays: number;
  insuranceName: string;
  insuranceRate: number;
  extras: string[];
}

export interface OrderEntity {
  id: number;  // Changed from string to number to match Long
  totalAmount: number;
  status: OrderStatus;
  customer: CustomerInfo;
  items: OrderItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

// For the UI
export interface OrderCard {
  id: number;
  orderNumber: string;
  totalAmount: number;
  status: OrderStatus;
  carInfo: string;
  rentalPeriod: string;
  createdAt: Date;
  itemCount: number;
}