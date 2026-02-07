export interface PaymentRequest {
    amount: number;
    currency: string;
    merchantOrderId: string;
    successUrl: string;
    failUrl: string;
    errorUrl: string;
  }
  
  export interface PaymentResponse {
    transactionId: string;
    paymentUrl: string;
    status: string;
    timestamp: Date;
  }
  
  export interface PaymentResult {
    transactionId: string;
    status: 'success' | 'failed' | 'pending';
    providerReference: string;
    amount: number;
    currency: string;
    timestamp: Date;
  }