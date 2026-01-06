import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { PaymentResult } from '../../models/payment.model';
import { Order } from 'src/app/models/order.model';
import { faCheckCircle, faCar, faCalendar, faMapMarker, faPrint, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss']
})
export class OrderConfirmationComponent implements OnInit {
  order!: Order;
  paymentResult!: PaymentResult;
  isLoading = true;
  
  // Icons
  faCheckCircle = faCheckCircle;
  faCar = faCar;
  faCalendar = faCalendar;
  faMapMarker = faMapMarker;
  faPrint = faPrint;
  faEnvelope = faEnvelope;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private paymentService: PaymentService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const transactionId = this.route.snapshot.params['transactionId'];
    this.loadOrderDetails(transactionId);
  }

  loadOrderDetails(transactionId: string): void {
    this.paymentService.getPaymentStatus(transactionId).subscribe({
      next: (result) => {
        this.paymentResult = result;
        this.loadOrder(result.transactionId);
      },
      error: (error) => {
        this.toastr.error('Failed to load payment details');
        this.isLoading = false;
      }
    });
  }

  loadOrder(transactionId: string): void {
    this.orderService.getOrderByPaymentId(transactionId).subscribe({
      next: (order: Order) => {
        this.order = order;
        this.isLoading = false;
      },
      error: (error : any) => {
        this.toastr.error('Failed to load order details');
        this.isLoading = false;
      }
    });
  }

  printConfirmation(): void {
    window.print();
  }

  sendConfirmationEmail(): void {
    // Send email logic
    this.toastr.success('Confirmation email sent!');
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}