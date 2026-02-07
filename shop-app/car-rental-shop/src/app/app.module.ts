import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CarListComponent } from './components/car-list/car-list.component';
// import { CarDetailComponent } from './components/car-detail/car-detail.component';
// import { CartComponent } from './components/cart/cart.component';
// import { CheckoutComponent } from './components/checkout/checkout.component';
import { PaymentComponent } from './components/payment/payment.component';
import { OrderConfirmationComponent } from './components/order-confirmation/order-confirmation.component';
// import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CartComponent } from './components/cart/cart.component';
import { LoginComponent } from './components/login/login.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { PaymentResultComponent } from './components/payment-result/payment-result.component';
// import { FooterComponent } from './components/footer/footer.component';
// import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
// import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    CarListComponent,
    // CarDetailComponent,
    // CartComponent,
    // CheckoutComponent,
    PaymentComponent,
    OrderConfirmationComponent,
    // UserProfileComponent,
    NavbarComponent,
    CartComponent,
    LoginComponent,
    PaymentResultComponent,
    // FooterComponent,
    // LoadingSpinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgbModule,
    FontAwesomeModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      progressBar: true
    })
  ], 
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }