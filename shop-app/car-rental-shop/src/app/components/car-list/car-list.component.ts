import { Component, OnInit } from '@angular/core';
import { CarService } from '../../services/car.service';
import { CartService } from '../../services/cart.service';
import { Car, InsuranceOption, ExtraOption } from '../../models/car.model';
import { faStar, faGasPump, faUsers, faCogs, faCalendar, faHeart } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.scss']
})
export class CarListComponent implements OnInit {
  cars: Car[] = [];
  filteredCars: Car[] = [];
  insuranceOptions: InsuranceOption[] = [];
  extras: ExtraOption[] = [];
  isLoading = true;
  
  // Icons
  faStar = faStar;
  faGasPump = faGasPump;
  faUsers = faUsers;
  faCogs = faCogs;
  faCalendar = faCalendar;
  faHeart = faHeart;
  
  // Filters
  filters = {
    type: '',
    brand: '',
    minPrice: 0,
    maxPrice: 1000,
    transmission: '',
    fuelType: ''
  };
  
  brands: string[] = [];
  types: string[] = ['sedan', 'suv', 'truck', 'convertible', 'luxury'];
  
  rentalPeriod = {
    startDate: new Date(),
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  };

  constructor(
    private carService: CarService,
    private cartService: CartService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCars();
    this.loadOptions();
  }

  loadCars(): void {
    this.isLoading = true;
    this.carService.getAvailableCars(this.rentalPeriod.startDate, this.rentalPeriod.endDate)
      .subscribe({
        next: (cars) => {
          this.cars = cars;
          this.filteredCars = [...cars];
          this.brands = [...new Set(cars.map(car => car.brand))];
          this.isLoading = false;
        },
        error: (error) => {
          this.toastr.error('Failed to load cars');
          this.isLoading = false;
        }
      });
  }

  loadOptions(): void {
    this.carService.getInsuranceOptions().subscribe(options => {
      this.insuranceOptions = options;
    });
    
    this.carService.getExtraOptions().subscribe(extras => {
      this.extras = extras;
    });
  }

  applyFilters(): void {
    this.filteredCars = this.cars.filter(car => {
      const matchesType = !this.filters.type || car.type === this.filters.type;
      const matchesBrand = !this.filters.brand || car.brand === this.filters.brand;
      const matchesPrice = car.dailyRate >= this.filters.minPrice && 
                          car.dailyRate <= this.filters.maxPrice;
      const matchesTransmission = !this.filters.transmission || 
                                 car.transmission === this.filters.transmission;
      const matchesFuel = !this.filters.fuelType || 
                         car.fuelType === this.filters.fuelType;
      
      return matchesType && matchesBrand && matchesPrice && 
             matchesTransmission && matchesFuel;
    });
  }

  resetFilters(): void {
    this.filters = {
      type: '',
      brand: '',
      minPrice: 0,
      maxPrice: 1000,
      transmission: '',
      fuelType: ''
    };
    this.filteredCars = [...this.cars];
  }

  rentNow(car: Car): void {
    const basicInsurance = this.insuranceOptions.find(opt => opt.name === 'Basic')!;
    this.cartService.addToCart(car, this.rentalPeriod.startDate, this.rentalPeriod.endDate ,basicInsurance, this.extras);
    
    this.router.navigate(['/cart']);
  }

  viewDetails(car: Car): void {
    this.router.navigate(['/cars', car.id]);
  }

  toggleFavorite(car: Car): void {
    // Toggle favorite logic
    this.toastr.info('Added to favorites!');
  }

  calculateDays(): number {
    const diff = this.rentalPeriod.endDate.getTime() - this.rentalPeriod.startDate.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getFeaturesString(features: string[]): string {
    return features.slice(0, 3).join(' • ');
  }
}