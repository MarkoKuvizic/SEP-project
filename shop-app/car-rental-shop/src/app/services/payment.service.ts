import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentRequest, PaymentResponse, PaymentResult } from '../models/payment.model';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private shopApiUrl = 'http://localhost:8080/api'; // ShopApp
  private pspApiUrl = 'http://localhost:8081/api'; // PSP

  constructor(private http: HttpClient) {}

  initiatePayment(order: Order): Observable<PaymentResponse> {
    const paymentRequest: PaymentRequest = {
      amount: order.totalAmount,
      currency: 'USD',
      merchantOrderId: order.id,
      successUrl: `${window.location.origin}/payment/success`,
      failUrl: `${window.location.origin}/payment/failed`,
      errorUrl: `${window.location.origin}/payment/error`
    };

    return this.http.post<PaymentResponse>(
      `${this.shopApiUrl}/payments/initiate`,
      paymentRequest
    );
  }

  getPaymentStatus(transactionId: string): Observable<PaymentResult> {
    return this.http.get<PaymentResult>(
      `${this.shopApiUrl}/payments/${transactionId}/status`
    );
  }

  processPayment(paymentMethod: string, paymentData: any): Observable<any> {
    return this.http.post(`${this.shopApiUrl}/payments/process`, {
      paymentMethod,
      ...paymentData
    });
  }

  handlePaymentCallback(params: any): Observable<any> {
    return this.http.post(`${this.shopApiUrl}/payments/callback`, params);
  }
}