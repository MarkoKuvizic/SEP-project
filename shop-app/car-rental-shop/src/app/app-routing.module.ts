import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarListComponent } from './components/car-list/car-list.component';
// import { CarDetailComponent } from './components/car-detail/car-detail.component';
// import { CartComponent } from './components/cart/cart.component';
// import { CheckoutComponent } from './components/checkout/checkout.component';
import { PaymentComponent } from './components/payment/payment.component';
import { OrderConfirmationComponent } from './components/order-confirmation/order-confirmation.component';
import { CartComponent } from './components/cart/cart.component';
import { LoginComponent } from './components/login/login.component';
import { PaymentResultComponent } from './components/payment-result/payment-result.component';
// import { UserProfileComponent } from './components/user-profile/user-profile.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  // { path: '', redirectTo: '/cars', pathMatch: 'full' },
  { path: 'cars', component: CarListComponent },
  // { path: 'cars/:id', component: CarDetailComponent },
  { path: 'cart', component: CartComponent },
  // { path: 'checkout', component: CheckoutComponent },
  { path: 'confirmation/:transactionId', component: OrderConfirmationComponent },
  // { path: 'profile', component: UserProfileComponent },
    { 
    path: 'payment-result/success', 
    component: PaymentResultComponent 
  },
  { 
    path: 'payment-result/failure', 
    component: PaymentResultComponent 
  },
  { 
    path: 'payment-result/error', 
    component: PaymentResultComponent 
  },
  // { path: '**', redirectTo: '/cars' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top',
    useHash: false 
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }