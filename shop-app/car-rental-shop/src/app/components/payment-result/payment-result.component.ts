import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-payment-result',
  templateUrl: './payment-result.component.html',
  styleUrls: ['./payment-result.component.scss']
})
export class PaymentResultComponent implements OnInit {
  status: 'success' | 'failed' | 'error' = 'success';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get status from URL path
    const path = this.router.url;
    
    if (path.includes('success')) {
      this.status = 'success';
    } else if (path.includes('failure')) {
      this.status = 'failed';
    } else if (path.includes('error')) {
      this.status = 'error';
    }
  }

  goHome(): void {
    this.router.navigate(['/cars']);
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }
}