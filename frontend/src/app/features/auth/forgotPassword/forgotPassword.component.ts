import { Component, signal,inject }      from '@angular/core';
import { CommonModule }           from '@angular/common';
import { FormsModule }            from '@angular/forms';
import { RouterLink }             from '@angular/router';
import { MatIconModule }          from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService }            from '@core/services/auth.service';

type ViewState = 'form' | 'sent';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatIconModule, MatProgressSpinnerModule],
  template: `
<div class="fp-wrap">
  <div class="fp-card">

    <!-- Logo / brand mark -->
    <div class="fp-brand">
      <div class="fp-brand-icon">
        <mat-icon>lock_reset</mat-icon>
      </div>
    </div>

    <!-- ── FORM VIEW ── -->
    @if (view() === 'form') {
      <div class="fp-body" [@.disabled]="true">

        <h1 class="fp-title">Forgot your password?</h1>
        <p class="fp-subtitle">
          Enter the email address linked to your account and we'll send you a reset link.
        </p>

        @if (errorMsg()) {
          <div class="fp-banner fp-banner--error">
            <mat-icon>error_outline</mat-icon>
            {{ errorMsg() }}
          </div>
        }

        <div class="fp-field" [class.fp-field--error]="touched && !email">
          <label class="fp-label" for="fp-email">Email address</label>
          <div class="fp-input-wrap">
            <mat-icon class="fp-input-icon">mail_outline</mat-icon>
            <input id="fp-email" class="fp-input" type="email"
                   placeholder="you@example.com"
                   autocomplete="email"
                   [(ngModel)]="email"
                   (keydown.enter)="submit()"
                   [disabled]="loading()"/>
          </div>
          @if (touched && !email) {
            <span class="fp-field-error">Email is required.</span>
          }
        </div>

        <button class="fp-btn" (click)="submit()" [disabled]="loading()">
          @if (loading()) {
            <mat-spinner diameter="18" class="fp-btn-spinner"/>
            Sending…
          } @else {
            <mat-icon>send</mat-icon>
            Send reset link
          }
        </button>

        <a class="fp-back" routerLink="/login">
          <mat-icon>arrow_back</mat-icon> Back to sign in
        </a>

      </div>
    }

    <!-- ── SUCCESS VIEW ── -->
    @if (view() === 'sent') {
      <div class="fp-body fp-body--success">
        <div class="fp-success-icon">
          <mat-icon>mark_email_read</mat-icon>
        </div>
        <h1 class="fp-title">Check your inbox</h1>
        <p class="fp-subtitle">
          If <strong>{{ email }}</strong> is registered, a password reset link is on its way.
          It may take a minute or two to arrive.
        </p>
        <p class="fp-hint">
          Didn't get it? Check your spam folder, or
          <button class="fp-link-btn" (click)="resend()" [disabled]="resendCooldown() > 0">
            resend{{ resendCooldown() > 0 ? ' in ' + resendCooldown() + 's' : '' }}
          </button>.
        </p>
        <a class="fp-back" routerLink="/login">
          <mat-icon>arrow_back</mat-icon> Back to sign in
        </a>
      </div>
    }

  </div>
</div>
  `,
  styles: [`
    .fp-wrap {
      min-height: 100vh;
      display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0fdf4 100%);
      padding: 24px;
    }

    .fp-card {
      width: 100%; max-width: 420px;
      background: #fff;
      border-radius: 20px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 8px 40px rgba(99,102,241,.1);
      padding: 40px 36px 36px;
      animation: fp-in .3s cubic-bezier(.16,1,.3,1);
    }
    @keyframes fp-in {
      from { opacity: 0; transform: translateY(18px) scale(.98); }
      to   { opacity: 1; transform: none; }
    }

    /* Brand mark */
    .fp-brand { display: flex; justify-content: center; margin-bottom: 28px; }
    .fp-brand-icon {
      width: 56px; height: 56px; border-radius: 16px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 16px rgba(99,102,241,.35);
      mat-icon { color: #fff; font-size: 26px; width: 26px; height: 26px; }
    }

    /* Body */
    .fp-body { display: flex; flex-direction: column; gap: 18px; }
    .fp-body--success { align-items: center; text-align: center; }

    .fp-title {
      margin: 0; font-size: 1.35rem; font-weight: 800;
      color: #1e293b; letter-spacing: -.02em; line-height: 1.2;
    }
    .fp-subtitle { margin: 0; font-size: .9rem; color: #64748b; line-height: 1.6; }

    /* Banner */
    .fp-banner {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 14px; border-radius: 10px;
      font-size: .85rem; font-weight: 500;
      mat-icon { font-size: 17px; width: 17px; height: 17px; flex-shrink: 0; }
    }
    .fp-banner--error { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; }

    /* Field */
    .fp-field { display: flex; flex-direction: column; gap: 5px; }
    .fp-label {
      font-size: .75rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: .06em; color: #475569;
    }
    .fp-input-wrap {
      display: flex; align-items: center;
      border: 1.5px solid #e2e8f0; border-radius: 11px; overflow: hidden;
      transition: border-color .2s, box-shadow .2s; background: #f8fafc;
    }
    .fp-field--error .fp-input-wrap { border-color: #f87171; }
    .fp-input-wrap:focus-within {
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99,102,241,.12);
      background: #fff;
    }
    .fp-input-icon {
      font-size: 17px; width: 17px; height: 17px;
      padding: 0 6px 0 12px; color: #94a3b8; pointer-events: none; flex-shrink: 0;
    }
    .fp-input {
      flex: 1; border: none; background: transparent; outline: none;
      padding: 11px 12px 11px 4px; font-size: .9rem; color: #1e293b;
      font-family: inherit;
      &::placeholder { color: #cbd5e1; }
      &:disabled { opacity: .6; cursor: not-allowed; }
    }
    .fp-field-error { font-size: .75rem; color: #dc2626; }

    /* Submit button */
    .fp-btn {
      display: flex; align-items: center; justify-content: center; gap: 7px;
      width: 100%; padding: 12px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff; border: none; border-radius: 11px;
      font-size: .9rem; font-weight: 700; cursor: pointer;
      box-shadow: 0 4px 14px rgba(99,102,241,.4);
      transition: opacity .2s, transform .15s, box-shadow .2s;
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
      &:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(99,102,241,.45); }
      &:active:not(:disabled) { transform: none; }
      &:disabled { opacity: .65; cursor: not-allowed; box-shadow: none; }
    }
    .fp-btn-spinner { display: inline-block; --mdc-circular-progress-active-indicator-color: #fff; }

    /* Back link */
    .fp-back {
      display: inline-flex; align-items: center; gap: 4px; justify-content: center;
      font-size: .85rem; font-weight: 600; color: #6366f1;
      text-decoration: none; transition: opacity .15s;
      mat-icon { font-size: 16px; width: 16px; height: 16px; }
      &:hover { opacity: .7; }
    }

    /* Success */
    .fp-success-icon {
      width: 64px; height: 64px; border-radius: 50%;
      background: #f0fdf4; border: 2px solid #bbf7d0;
      display: flex; align-items: center; justify-content: center;
      mat-icon { font-size: 30px; width: 30px; height: 30px; color: #16a34a; }
    }
    .fp-hint {
      margin: 0; font-size: .85rem; color: #64748b;
      line-height: 1.6;
    }
    .fp-link-btn {
      background: none; border: none; cursor: pointer;
      color: #6366f1; font-size: inherit; font-weight: 600; padding: 0;
      text-decoration: underline;
      &:disabled { color: #94a3b8; cursor: default; text-decoration: none; }
    }
  `],
})
export class ForgotPasswordComponent {
  private authSvc = inject(AuthService);

  view     = signal<ViewState>('form');
  loading  = signal(false);
  errorMsg = signal('');
  touched  = false;

  email = '';

  resendCooldown  = signal(0);
  private _timer: ReturnType<typeof setInterval> | null = null;

  submit(): void {
    this.touched = true;
    if (!this.email.trim()) return;

    this.loading.set(true);
    this.errorMsg.set('');

    this.authSvc.forgotPassword(this.email.trim()).subscribe({
      next: () => {
        this.loading.set(false);
        this.view.set('sent');
        this._startCooldown(60);
      },
      error: () => {
        this.loading.set(false);
        this.errorMsg.set('Something went wrong. Please try again.');
      },
    });
  }

  resend(): void {
    this.authSvc.forgotPassword(this.email.trim()).subscribe();
    this._startCooldown(60);
  }

  private _startCooldown(seconds: number): void {
    this.resendCooldown.set(seconds);
    if (this._timer) clearInterval(this._timer);
    this._timer = setInterval(() => {
      const next = this.resendCooldown() - 1;
      this.resendCooldown.set(next);
      if (next <= 0 && this._timer) { clearInterval(this._timer); this._timer = null; }
    }, 1000);
  }
}