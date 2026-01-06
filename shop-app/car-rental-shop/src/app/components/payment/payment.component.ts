import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';
import { CartService } from '../../services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { faCreditCard, faLock, faShieldAlt } from '@fortawesome/free-solid-svg-icons';

declare const Stripe: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  @ViewChild('cardElement') cardElement!: ElementRef;
  
  paymentForm: FormGroup;
  stripe: any;
  card: any;
  isCardValid = false;
  isLoading = false;
  
  // Icons
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

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.paymentForm = this.fb.group({
      cardholderName: ['', [Validators.required]],
      saveCard: [false],
      termsAccepted: [false, [Validators.requiredTrue]]
    });
  }

  async ngOnInit() {
    this.orderTotal = this.cartService.getCartTotal();
    this.orderId = this.route.snapshot.params['orderId'];
    
    // Initialize Stripe
    this.stripe = Stripe('pk_test_your_stripe_key');
    const elements = this.stripe.elements();
    
    this.card = elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#32325d',
          '::placeholder': {
            color: '#aab7c4'
          }
        }
      }
    });
    
    this.card.mount(this.cardElement.nativeElement);
    this.card.on('change', (event: any) => {
      this.isCardValid = event.complete;
    });
  }

  selectPaymentMethod(methodId: string): void {
    this.selectedMethod = methodId;
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
        await this.processPaypalPayment();
      }
    } catch (error) {
      this.toastr.error('Payment failed. Please try again.');
      this.isLoading = false;
    }
  }

  private async processCardPayment(): Promise<void> {
    const { token, error } = await this.stripe.createToken(this.card);
    
    if (error) {
      this.toastr.error(error.message);
      this.isLoading = false;
      return;
    }

    const paymentData = {
      orderId: this.orderId,
      paymentMethod: 'card',
      token: token.id,
      cardholderName: this.paymentForm.get('cardholderName')?.value
    };

    this.paymentService.processPayment('card', paymentData).subscribe({
      next: (response) => {
        this.toastr.success('Payment successful!');
        this.cartService.clearCart();
        this.router.navigate(['/confirmation', response.transactionId]);
      },
      error: (error) => {
        this.toastr.error('Payment failed: ' + error.error.message);
        this.isLoading = false;
      }
    });
  }

  private async processPaypalPayment(): Promise<void> {
    // Implement PayPal integration
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