import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let clonedRequest = request;
    
    clonedRequest = request.clone({
      withCredentials: true
    });

    const csrfToken = this.authService.getCsrfToken();
    if (csrfToken && !request.method.includes('GET')) {
      clonedRequest = clonedRequest.clone({
        setHeaders: {
          'X-XSRF-TOKEN': csrfToken
        }
      });
    }

    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          this.authService.clearAuthData();
          this.toastr.error('Session expired. Please login again.');
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: this.router.url }
          });
        } else if (error.status === 0) {
          this.toastr.error('Cannot connect to server. Please check your connection.');
        } else if (error.status >= 500) {
          this.toastr.error('Server error. Please try again later.');
        }
        console.error('HTTP ERROR:', error);

        
        return throwError(() => error);
      })
    );
  }
}