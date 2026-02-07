import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';
import { ToastrService } from 'ngx-toastr';
import { faCreditCard, faLock, faShieldAlt } from '@fortawesome/free-solid-svg-icons';

declare const Stripe: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit, AfterViewInit {
  
  paymentForm: FormGroup;
  isCardValid = false;
  isLoading = false;
  
  faCreditCard = faCreditCard;
  // faPaypal = faPaypal;
  // faApple = faApple;
  faLock = faLock;
  faShieldAlt = faShieldAlt;
  
  // Payment methods
  paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: faCreditCard, active: true },
    // { id: 'paypal', name: 'PayPal', icon: faPaypal, active: true },
    // { id: 'apple', name: 'Apple Pay', icon: faApple, active: false }
  ];
  
  selectedMethod = 'card';
  orderTotal = 120;
  orderId = '';

  cardNumber = '';
  expiry = '';
  cvc = '';

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.paymentForm = this.fb.group({
    cardNumber: ['', [Validators.required, Validators.minLength(13)]],
    expiry: ['', [Validators.required]],
    cvc: ['', [Validators.required, Validators.minLength(3)]],
    cardholderName: ['', Validators.required],
    saveCard: [false],
    termsAccepted: [false, Validators.requiredTrue]
  });

  }

  async ngOnInit() {
    this.orderId = this.route.snapshot.params['orderId'];
    this.paymentService.getPaymentAmount(this.orderId).subscribe({
      next: (response) => {
        this.orderTotal = response
      },
      error: (error) => {  
        console.error('Failed to get payment amount', error);    
      }
    }
    )
  }
  ngAfterViewInit() {
  }

  

  selectPaymentMethod(methodId: string): void {
    this.selectedMethod = methodId;
  }
  onCardNumberInput() {
      this.cardNumber = this.cardNumber
        .replace(/\D/g, '')
        .replace(/(.{4})/g, '$1 ')
        .trim();
    }

    onExpiryInput() {
      this.expiry = this.expiry
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d{0,2})/, '$1 / $2')
        .substr(0, 7);
    }


  async processPayment(): Promise<void> {
    if (!this.paymentForm.valid) {
      this.markFormGroupTouched(this.paymentForm);
      return;
    }

    this.isLoading = true;

    try {
      if (this.selectedMethod === 'card') {
        await this.processCardPayment();
      } else if (this.selectedMethod === 'paypal') {
        // await this.processPaypalPayment();
      }
    } catch (error) {
      this.toastr.error('Payment failed. Please try again.');
      this.isLoading = false;
    }
  }

  private async processCardPayment(): Promise<void> {
  if (this.paymentForm.invalid) {
    this.paymentForm.markAllAsTouched();
    return;
  }

  const {
    cardNumber,
    expiry,
    cvc,
    cardholderName
  } = this.paymentForm.value;

  const paymentData = {
    cardNumber: cardNumber.replace(/\s/g, ''),
    expiry: expiry,
    cvc: cvc,
    cardholderName: cardholderName,

    transactionId: String(this.orderId),
    paymentMethod: 'CARD',
    token: 'aaa'
  };

  console.log('CARD PAYMENT PAYLOAD', paymentData);

  this.isLoading = true;

  this.paymentService.processPayment('card', paymentData).subscribe({
    next: (response) => {
      this.toastr.success('Payment successful!');
      console.log(response)
      window.location.href = response.message;
      this.isLoading = false;
    },
    error: (error) => {
      console.log(error)
      this.toastr.error('Payment failed: ' + error?.error?.message);
      this.isLoading = false;
    }
  });
}

  private async processPaypalPayment(): Promise<void> {
    this.toastr.info('Redirecting to PayPal...');
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }
}