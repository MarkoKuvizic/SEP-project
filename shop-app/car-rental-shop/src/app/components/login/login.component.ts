import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { faSignInAlt, faUser, faLock, faEye, faEyeSlash, faCar, faEnvelope } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;
  returnUrl: string = '';
  
  faSignInAlt = faSignInAlt;
  faUser = faUser;
  faLock = faLock;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  faCar = faCar;
  faEnvelope = faEnvelope;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/cars';
    
    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.isLoading = true;
    
    const credentials = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };

    this.authService.login(credentials).subscribe({
      next: (response : any) => {
        this.isLoading = false;
        this.toastr.success('Login successful!');
        this.router.navigate([this.returnUrl]);
      },
      error: (error : any) => {
        this.isLoading = false;
        let errorMessage = 'Login failed. Please check your credentials.';
        
        if (error.status === 401) {
          errorMessage = 'Invalid username or password';
        } else if (error.status === 0) {
          errorMessage = 'Cannot connect to server. Please try again later.';
        }
        
        this.toastr.error(errorMessage);
        console.error('Login error:', error);
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  navigateToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }

  get testAccounts(): any[] {
    return [
      { username: 'user', password: 'user', role: 'Regular User' },
      { username: 'admin', password: 'admin', role: 'Administrator' }
    ];
  }

  fillTestAccount(account: any): void {
    this.loginForm.patchValue({
      username: account.username,
      password: account.password
    });
  }
}