import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { faQrcode, faMobileAlt, faClock, faCheck, faRedo, faArrowLeft, faDownload } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-qr-payment',
  templateUrl: './qr-payment.component.html',
  styleUrls: ['./qr-payment.component.scss']
})
export class QrPaymentComponent implements OnInit, OnDestroy {
  paymentId: string = '';
  qrImageUrl: SafeUrl | string = '';
  isLoading = true;
  isQrGenerated = false;
  countdown = 300; // 5 minutes in seconds
  countdownInterval: any;
  
  // Icons
  faQrcode = faQrcode;
  faMobileAlt = faMobileAlt;
  faClock = faClock;
  faCheck = faCheck;
  faRedo = faRedo;
  faArrowLeft = faArrowLeft;
  faDownload = faDownload;
  
  // Steps for QR payment
  steps = [
    { icon: '📱', text: 'Open your mobile banking app' },
    { icon: '📷', text: 'Scan the QR code with your camera' },
    { icon: '✅', text: 'Confirm the payment on your phone' },
    { icon: '⏱️', text: 'Wait for automatic confirmation' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.paymentId = this.route.snapshot.paramMap.get('paymentId') || '';
    
    if (this.paymentId) {
      this.generateQRCode();
      this.startCountdown();
    } else {
      this.toastr.error('No payment ID provided');
      this.router.navigate(['/cart']);
    }
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  generateQRCode(): void {
    this.isLoading = true;
    
    const qrEndpoint = `http://localhost:8082/api/transactions/qr/${this.paymentId}`;
    
    this.http.get(qrEndpoint, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.qrImageUrl = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
          this.isLoading = false;
          this.isQrGenerated = true;
          this.toastr.success('QR code generated!');
        };
        reader.readAsDataURL(blob);
      },
      error: (error) => {
        console.error('Error generating QR code:', error);
        this.isLoading = false;
        this.toastr.error('Failed to generate QR code. Please try again.');
        
        // Fallback: Use a generic QR code with payment ID
        this.useGenericQRCode();
      }
    });
  }

  useGenericQRCode(): void {
    // Fallback to a generic QR code generator service
    const genericQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PAYMENT-${this.paymentId}`;
    this.qrImageUrl = genericQrUrl;
    this.isQrGenerated = true;
  }

  startCountdown(): void {
    this.countdownInterval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        clearInterval(this.countdownInterval);
        this.toastr.warning('QR code expired. Please generate a new one.');
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  checkPaymentStatus(): void {
    this.isLoading = true;
    
    // Call your PSP endpoint to check payment status
    this.http.get(`http://localhost:8080/api/transactions/${this.paymentId}/status`)
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          
          if (response.status === 'SUCCESS') {
            this.toastr.success('Payment confirmed!');
            this.router.navigate(['/payment/success'], {
              queryParams: { transactionId: this.paymentId }
            });
          } else if (response.status === 'FAILED') {
            this.toastr.error('Payment failed. Please try again.');
            this.router.navigate(['/payment/failed']);
          } else {
            this.toastr.info('Payment is still pending. Please complete the payment on your phone.');
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.toastr.error('Error checking payment status');
        }
      });
  }

  refreshQRCode(): void {
    this.generateQRCode();
    this.countdown = 300; // Reset to 5 minutes
    this.startCountdown();
  }

  downloadQRCode(): void {
    if (typeof this.qrImageUrl === 'string') {
      const link = document.createElement('a');
      link.href = this.qrImageUrl;
      link.download = `payment-qr-${this.paymentId}.png`;
      link.click();
    }
  }

  goBack(): void {
    this.router.navigate(['/cart']);
  }

  get isExpired(): boolean {
    return this.countdown <= 0;
  }
}