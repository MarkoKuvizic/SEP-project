import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem, Car, RentalPeriod, InsuranceOption, ExtraOption } from '../models/car.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  private readonly CART_STORAGE_KEY = 'car_rental_cart';

  constructor(private toastr: ToastrService) {
    this.loadCartFromStorage();
  }

  addToCart(car: Car, rentalFrom: Date, rentalTo: Date, insurance: InsuranceOption, extras: ExtraOption[]): void {
    const existingIndex = this.cartItems.findIndex(item => item.car.id === car.id);
    console.log(car)

    if (existingIndex > -1) {
      this.cartItems[existingIndex] = {
        car,
        rentalFrom,
        rentalTo,
        totalPrice: this.calculateTotal(car, rentalFrom,
          rentalTo, insurance, extras),
        insurance,
        extras
      };
      this.toastr.info('Cart item updated!');
    } else {
      const cartItem: CartItem = {
        car,
        rentalFrom,
        rentalTo,
        totalPrice: this.calculateTotal(car, rentalFrom, rentalTo, insurance, extras),
        insurance,
        extras: extras.filter(extra => extra.selected)
      };
      this.cartItems.push(cartItem);
      this.toastr.success('Car added to cart!');
    }
    
    this.updateCart();
  }

  removeFromCart(carId: string): void {
    this.cartItems = this.cartItems.filter(item => item.car.id !== carId);
    this.updateCart();
    this.toastr.warning('Car removed from cart');
  }

  clearCart(): void {
    this.cartItems = [];
    this.updateCart();
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }

  getCartTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.totalPrice, 0);
  }

  getItemCount(): number {
    return this.cartItems.length;
  }

  private calculateTotal(car: Car, rentalFrom: Date, rentalTo: Date, insurance: InsuranceOption, extras: ExtraOption[]): number {
    const days =
    Math.ceil(
      (new Date(rentalTo).getTime() - new Date(rentalFrom).getTime()) /
      (1000 * 60 * 60 * 24)
    );
    const carPrice = car.dailyRate * days;
    const insurancePrice = 0;
    const extrasPrice = extras
      .filter(extra => extra.selected)
      .reduce((sum, extra) => sum + extra.price, 0);
    
    return carPrice + insurancePrice + extrasPrice;
  }

  private updateCart(): void {
    this.cartSubject.next([...this.cartItems]);
    this.saveCartToStorage();
  }

  private saveCartToStorage(): void {
    localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(this.cartItems));
  }

  private loadCartFromStorage(): void {
    const savedCart = localStorage.getItem(this.CART_STORAGE_KEY);
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.cartSubject.next([...this.cartItems]);
    }
  }
}