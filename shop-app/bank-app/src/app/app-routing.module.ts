import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentComponent } from './components/payment/payment.component';
import { QrPaymentComponent } from './components/qr-payment/qr-payment.component';
import { QrScannerComponent } from './components/qr-scanner/qr-scanner.component';

const routes: Routes = [
    { path: 'payment/:orderId', component: PaymentComponent },
    { 
    path: 'payment/qr/:paymentId', 
    component: QrPaymentComponent 
    },
    {
      path: 'qr-scanner',
      component: QrScannerComponent
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top',
    useHash: false 
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }