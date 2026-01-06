import { Car, ExtraOption, InsuranceOption, RentalPeriod } from "./car.model";

export interface Order {
    id: string;
    car: Car;
    rentalPeriod: RentalPeriod;
    customer: CustomerInfo;
    totalAmount: number;
    taxAmount: number;
    insurance: InsuranceOption;
    extras: ExtraOption[];
    status: 'pending' | 'confirmed' | 'paid' | 'active' | 'completed' | 'cancelled';
    paymentStatus: 'unpaid' | 'paid' | 'refunded' | 'failed';
    paymentTransactionId?: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface CustomerInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    driverLicense: string;
    dateOfBirth: Date;
  }
  
  