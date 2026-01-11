import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CarService } from '../../services/car.service';
import { CartItem, Car, InsuranceOption, ExtraOption, RentalPeriod } from '../../models/car.model';
import { faTrash, faPlus, faMinus, faCalendar, faShieldAlt, faCog, faArrowLeft, faCreditCard, faTags, faStar } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  isLoading = false;
  insuranceOptions: InsuranceOption[] = [];
  extraOptions: ExtraOption[] = [];
  
  // Icons
  faTrash = faTrash;
  faPlus = faPlus;
  faMinus = faMinus;
  faCalendar = faCalendar;
  faShieldAlt = faShieldAlt;
  faCog = faCog;
  faArrowLeft = faArrowLeft;
  faCreditCard = faCreditCard;
  faTags = faTags;
  faStar = faStar
  
  // Forms
  dateForm: FormGroup;
  
  // Promo code
  promoCode = '';
  discount = 0;
  discountPercentage = 0;

  constructor(
    private cartService: CartService,
    private carService: CarService,
    private orderService: OrderService,
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.dateForm = this.fb.group({
      startDate: [''],
      endDate: ['']
    });
  }

  ngOnInit(): void {
    this.loadCartItems();
    this.loadOptions();
  }

  loadCartItems(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      if (items.length > 0) {
        const firstItem = items[0];
        this.dateForm.patchValue({
          startDate: this.formatDateForInput(firstItem.rentalFrom),
          endDate: this.formatDateForInput(firstItem.rentalTo)
        });
      }
    });
  }

  loadOptions(): void {
    this.carService.getInsuranceOptions().subscribe(options => {
      this.insuranceOptions = options;
    });
    
    this.carService.getExtraOptions().subscribe(extras => {
      this.extraOptions = extras.map(extra => ({
        ...extra,
        selected: false
      }));
    });
  }

  getCartTotal(): number {
    const subtotal = this.cartService.getCartTotal();
    return subtotal - this.discount;
  }

  getSubtotal(): number {
    return this.cartService.getCartTotal();
  }

  getTax(): number {
    return this.getSubtotal() * 0.08; // 8% tax
  }

  getGrandTotal(): number {
    return this.getSubtotal() + this.getTax() - this.discount;
  }

  removeItem(carId: string): void {
    this.cartService.removeFromCart(carId);
    this.toastr.warning('Item removed from cart');
  }

  updateDates(): void {
    const startDate = new Date(this.dateForm.value.startDate);
    const endDate = new Date(this.dateForm.value.endDate);
    
    if (startDate && endDate && startDate < endDate) {
      const rentalPeriod: RentalPeriod = {
        startDate,
        endDate,
        totalDays: this.calculateDays(startDate, endDate)
      };
      
      // Update all items with new dates
      this.cartItems.forEach(item => {
        this.cartService.addToCart(
          item.car,
          startDate,
          endDate,
          item.insurance,
          item.extras
        );
      });
      
      this.toastr.success('Rental dates updated');
      this.loadCartItems(); // Refresh cart items
    } else {
      this.toastr.error('Please select valid dates');
    }
  }

  updateInsurance(item: CartItem, insuranceId: string): void {
    const insurance = this.insuranceOptions.find(opt => opt.id === insuranceId);
    if (insurance) {
      this.cartService.addToCart(
        item.car,
        item.rentalFrom,
        item.rentalTo,
        insurance,
        item.extras
      );
      this.toastr.info('Insurance updated');
    }
  }

  toggleExtra(item: CartItem, extraId: string): void {
    const extras = item.extras.map(extra => 
      extra.id === extraId 
        ? { ...extra, selected: !extra.selected }
        : extra
    );
    
    this.cartService.addToCart(
      item.car,
      item.rentalFrom,
      item.rentalTo,
      item.insurance,
      extras
    );
    
    this.loadCartItems(); // Refresh
  }

  applyPromoCode(): void {
    const codes: { [key: string]: number } = {
      'WELCOME10': 10,
      'SUMMER20': 20,
      'FIRST25': 25
    };
    
    if (this.promoCode in codes) {
      this.discountPercentage = codes[this.promoCode];
      this.discount = (this.getSubtotal() * this.discountPercentage) / 100;
      this.toastr.success(`Promo code applied! ${this.discountPercentage}% discount`);
    } else {
      this.discount = 0;
      this.discountPercentage = 0;
      this.toastr.error('Invalid promo code');
    }
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.cartItems = [];
    this.discount = 0;
    this.promoCode = '';
    this.toastr.info('Cart cleared');
  }

  proceedToCheckout(): void {
    if (this.cartItems.length === 0) {
      this.toastr.error('Your cart is empty');
      return;
    }
  
    const orderRequest = {
      items: this.cartItems.map(item => ({
        car: item.car,
        rentalTo: item.rentalTo,
        rentalFrom: item.rentalFrom,
        insurance: item.insurance,
        extraIds: item.extras.map(e => e.id),
        totalPrice: item.totalPrice,
        extras: []
      })),
      totalAmount: this.cartItems.reduce((sum, i) => sum + i.totalPrice, 0),
      currency: 'USD'
    };
  
    this.orderService.createOrder(orderRequest["items"], {}).subscribe({
      next: res => {
        window.location.href = res.paymentUrl
      },
      error: () => {
        this.toastr.error('Failed to create order');
      }
    });
  }
  
  continueShopping(): void {
    this.router.navigate(['/cars']);
  }

  calculateDays(
    startDate: Date | string,
    endDate: Date | string
  ): number {
    const start = typeof startDate === "string"
      ? new Date(startDate)
      : startDate;
  
    const end = typeof endDate === "string"
      ? new Date(endDate)
      : endDate;
  
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error("Invalid date provided");
    }
  
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  formatDateForInput(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  isExtraSelected(item: CartItem, extraId: string): boolean {
    return item.extras.some(extra => extra.id === extraId && extra.selected);
  }

  getExtrasTotal(item: CartItem): number {
    return item.extras
      .filter(extra => extra.selected)
      .reduce((sum, extra) => sum + extra.price, 0);
  }

  getItemTotal(item: CartItem): number {
    const days = this.calculateDays(
      new Date(item.rentalFrom),
      new Date(item.rentalTo)
    );
    const carPrice = item.car.dailyRate * days;
    const insurancePrice = 0 * days;
    const extrasPrice = this.getExtrasTotal(item);
    return carPrice + insurancePrice + extrasPrice;
  }
}