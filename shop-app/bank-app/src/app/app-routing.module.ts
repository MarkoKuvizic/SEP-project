import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentComponent } from './components/payment/payment.component';

const routes: Routes = [
    { path: 'payment/:orderId', component: PaymentComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top',
    useHash: false 
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }