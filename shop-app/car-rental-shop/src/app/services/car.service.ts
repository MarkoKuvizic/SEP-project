import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Car, InsuranceOption, ExtraOption } from '../models/car.model';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private apiUrl = 'http://localhost:8080/api'; // TODO: If we need to run this on multiple PCs this is gonna have to know the actual IP 
  private carsCache: Car[] | null = null;

  constructor(private http: HttpClient) {}

  getAllCars(): Observable<Car[]> {
    if (this.carsCache) {
      return of(this.carsCache);
    }
    return this.http.get<Car[]>(`${this.apiUrl}/cars`).pipe(
      tap(cars => this.carsCache = cars)
    );
  }

  getCarById(id: string): Observable<Car> {
    const cachedCar = this.carsCache?.find(car => car.id === id);
    if (cachedCar) {
      return of(cachedCar);
    }
    return this.http.get<Car>(`${this.apiUrl}/cars/${id}`);
  }

  getAvailableCars(startDate: Date, endDate: Date): Observable<Car[]> {
    const params = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
    // return this.http.get<Car[]>(`${this.apiUrl}/cars/available`, { params });
    
    const mockCar: Car = {
      id: 'car-001',
      model: 'Model S',
      brand: 'Tesla',
      year: 2024,
      type: 'luxury',
      transmission: 'automatic',
      fuelType: 'electric',
      seats: 5,
      doors: 4,
      luggageCapacity: 793,
      dailyRate: 149.99,
      weeklyRate: 899.99,
      imageUrl: 'https://example.com/images/tesla-model-s.jpg',
      images: [
        'https://example.com/images/tesla-model-s-1.jpg',
        'https://example.com/images/tesla-model-s-2.jpg'
      ],
      features: [
        'Autopilot',
        'GPS Navigation',
        'Bluetooth',
        'Heated Seats'
      ],
      available: true,
      location: 'San Francisco, CA',
      rating: 4.8,
      reviewCount: 124
    };
    

    return of([mockCar]);
  }

  getInsuranceOptions(): Observable<InsuranceOption[]> {
    // return this.http.get<InsuranceOption[]>(`${this.apiUrl}/insurance`);
    return of([]);
  }

  getExtraOptions(): Observable<ExtraOption[]> {
    // return this.http.get<ExtraOption[]>(`${this.apiUrl}/extras`);
    return of([]);
  }

  searchCars(filters: any): Observable<Car[]> {
    return this.http.post<Car[]>(`${this.apiUrl}/cars/search`, filters);
  }
}