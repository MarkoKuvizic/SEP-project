import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  available: boolean;
}

@Component({
  selector: 'app-payment-method-selection',
  templateUrl: './payment-method-selection.component.html',
  styleUrls: ['./payment-method-selection.component.scss']
})
export class PaymentMethodSelectionComponent implements OnInit {
  orderId: string = '';
  
  paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Pay with Visa, Mastercard, or other cards',
      icon: '💳',
      color: '#3a86ff',
      available: true
    },
    {
      id: 'qr',
      name: 'QR Code',
      description: 'Scan to pay with mobile banking apps',
      icon: '📱',
      color: '#8338ec',
      available: true
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Pay with your PayPal account',
      icon: '🔵',
      color: '#0070ba',
      available: false
    },
    {
      id: 'apple',
      name: 'Apple Pay',
      description: 'Pay with Apple Wallet',
      icon: '',
      color: '#000000',
      available: false
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('orderId') || '';
  }

  selectMethod(method: PaymentMethod): void {
    if (!method.available) {
      alert(`${method.name} is coming soon!`);
      return;
    }
    
  window.location.href = `https://localhost:4202/payment/${this.orderId}`;
  }

  goBack(): void {
    this.router.navigate(['/cart']);
  }
}