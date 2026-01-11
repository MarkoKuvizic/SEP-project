export interface Car {
    id: string;
    model: string;
    brand: string;
    yearCreated: number;
    type: 'sedan' | 'suv' | 'truck' | 'convertible' | 'luxury';
    transmission: 'automatic' | 'manual';
    fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
    seats: number;
    doors: number;
    luggageCapacity: number;
    dailyRate: number;
    weeklyRate: number;
    imageUrl: string;
    images: string[];
    features: string[];
    available: boolean;
    location: string;
    rating: number;
    reviewCount: number;
  }
  
  export interface RentalPeriod {
    startDate: Date;
    endDate: Date;
    totalDays: number;
  }
  
  export interface CartItem {
    car: Car;
    rentalTo: Date;
    rentalFrom: Date;
    totalPrice: number;
    insurance: InsuranceOption;
    extras: ExtraOption[];
  }
  
  export interface InsuranceOption {
    id: string;
    name: string;
    description: string;
    dailyRate: number;
    coverage: string;
  }
  
  export interface ExtraOption {
    id: string;
    name: string;
    description: string;
    price: number;
    selected: boolean;
  }
  