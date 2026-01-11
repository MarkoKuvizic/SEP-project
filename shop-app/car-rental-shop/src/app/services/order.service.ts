import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Order, OrderResponse } from '../models/order.model';
import { CartItem } from '../models/car.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'https://localhost:8444/api/orders'; // ShopApp backend

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  createOrder(cartItems: CartItem[], customerInfo: any): Observable<OrderResponse> {
    const orderRequest = {
      items: cartItems,
      customer: customerInfo,
      totalAmount: this.calculateTotal(cartItems)
    };
    console.log(orderRequest)

    return this.http.post<OrderResponse>(this.apiUrl, orderRequest).pipe(
      tap(order => {
        this.toastr.success('Order created successfully!');
      }),
      catchError(error => {
        this.toastr.error('Failed to create order');
        throw error;
      })
    );
  }

  getOrderById(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${orderId}`);
  }

  getOrderByPaymentId(paymentId: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/by-payment/${paymentId}`);
  }

  updateOrderStatus(orderId: string, status: string): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${orderId}/status`, { status });
  }

  getUserOrders(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/user/${userId}`);
  }

  cancelOrder(orderId: string): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/${orderId}/cancel`, {});
  }

  private calculateTotal(cartItems: CartItem[]): number {
    return cartItems.reduce((total, item) => total + item.totalPrice, 0);
  }
}