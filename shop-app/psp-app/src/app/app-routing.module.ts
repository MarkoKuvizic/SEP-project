import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentMethodSelectionComponent } from './components/payment-method-selection/payment-method-selection.component';

const routes: Routes = [
    { 
    path: 'payment-method/:orderId', 
    component: PaymentMethodSelectionComponent 
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top',
    useHash: false 
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }