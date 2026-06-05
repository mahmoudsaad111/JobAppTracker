import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatProgressSpinnerModule, MatCheckboxModule
  ],
  template: `
    <div class="auth-form">
      <h2>Welcome back</h2>
      <p class="subtitle">Sign in to your JobTracker account</p>

      <form [formGroup]="form" (ngSubmit)="submit()">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" placeholder="you@example.com">
          <mat-icon matPrefix>email</mat-icon>
          @if (form.get('email')?.hasError('required') && form.get('email')?.touched) {
            <mat-error>Email is required</mat-error>
          }
          @if (form.get('email')?.hasError('email') && form.get('email')?.touched) {
            <mat-error>Enter a valid email</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Password</mat-label>
          <input matInput [type]="showPwd ? 'text' : 'password'" formControlName="password">
          <mat-icon matPrefix>lock</mat-icon>
          <button mat-icon-button matSuffix type="button" (click)="showPwd = !showPwd">
            <mat-icon>{{ showPwd ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          @if (form.get('password')?.hasError('required') && form.get('password')?.touched) {
            <mat-error>Password is required</mat-error>
          }
        </mat-form-field>
        <div class="forgot-row">
          <a routerLink="/forgot-password" class="forgot-link">Forgot password?</a>
        </div>

        @if (errorMessage) {
          <div class="error-banner">
            <mat-icon>error_outline</mat-icon>
            {{ errorMessage }}
          </div>
        }

        <button mat-flat-button color="primary" class="w-full submit-btn" type="submit" [disabled]="loading">
          @if (loading) {
            <mat-spinner diameter="20" />
          } @else {
            Sign In
          }
        </button>
      </form>

      <p class="switch-link">
        Don't have an account?
        <a routerLink="/auth/register">Create one</a>
      </p>
    </div>
  `,
  styles: [`
    .auth-form {
      h2 { font-size: 1.5rem; font-weight: 700; color: #1a1f3a; }
      .subtitle { color: #6b7280; margin: 4px 0 24px; font-size: .9rem; }
    }
    form { display: flex; flex-direction: column; gap: 4px; }

    .forgot-row {
      display: flex; justify-content: flex-end;
      margin-top: -8px; margin-bottom: 4px;
    }
    .forgot-link {
      font-size: .8rem; font-weight: 600;
      color: #3949ab; text-decoration: none;
      transition: opacity .15s;
      &:hover { opacity: .7; text-decoration: underline; }
    }
    .submit-btn {
      margin-top: 8px; height: 48px; font-size: 1rem; font-weight: 600;
      border-radius: 10px !important;
      display: flex; align-items: center; justify-content: center;
    }
    .error-banner {
      display: flex; align-items: center; gap: 8px;
      background: #fee2e2; color: #991b1b;
      padding: 10px 14px; border-radius: 8px; font-size: .875rem;
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
    }
    .switch-link {
      text-align: center; margin-top: 20px;
      color: #6b7280; font-size: .875rem;
      a { color: #3949ab; font-weight: 600; text-decoration: none;
          &:hover { text-decoration: underline; } }
    }
  `]
})
export class LoginComponent {
  private auth   = inject(AuthService);
  private notify = inject(NotificationService);
  private router = inject(Router);

  form = inject(FormBuilder).nonNullable.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  loading      = false;
  showPwd      = false;
  errorMessage = '';

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading      = true;
    this.errorMessage = '';

    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.notify.success('Welcome back!');
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.loading = false;
        this.errorMessage = err.error?.message ?? 'Invalid email or password.';
      },
      complete: () => { this.loading = false; }
    });
  }
}