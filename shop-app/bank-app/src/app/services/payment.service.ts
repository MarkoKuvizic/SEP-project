import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentRequest, PaymentResponse, PaymentResult } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private shopApiUrl = 'https://localhost:8445/api'; 

  constructor(private http: HttpClient) {}

  getPaymentStatus(transactionId: string): Observable<PaymentResult> {
    return this.http.get<PaymentResult>(
      `${this.shopApiUrl}/transactions/status/${transactionId}`
    );
  }

  processPayment(paymentMethod: string, paymentData: any): Observable<any> {
    return this.http.post(`${this.shopApiUrl}/transactions/pay/${paymentData.transactionId}`, {
      paymentMethod,
      ...paymentData
    });
  }

  handlePaymentCallback(params: any): Observable<any> {
    return this.http.post(`${this.shopApiUrl}/payments/callback`, params);
  }

  getPaymentAmount(id: String): Observable<any> {
    return this.http.get(`${this.shopApiUrl}/transactions/${id}`);
  }

  getPaymentToken(id: String): Observable<any> {
    return this.http.get(`${this.shopApiUrl}/transactions/publicKey/${id}`);
  }
}