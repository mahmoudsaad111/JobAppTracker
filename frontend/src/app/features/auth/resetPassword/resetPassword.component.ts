import { Component, OnInit, signal,inject } from '@angular/core';
import { CommonModule }              from '@angular/common';
import { FormsModule }               from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule }             from '@angular/material/icon';
import { MatProgressSpinnerModule }  from '@angular/material/progress-spinner';
import { AuthService }               from '@core/services/auth.service';

type ViewState = 'form' | 'success' | 'invalid';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatIconModule, MatProgressSpinnerModule],
  template: `
<div class="rp-wrap">
  <div class="rp-card">

    <div class="rp-brand">
      <div class="rp-brand-icon" [class.rp-brand-icon--error]="view() === 'invalid'"
                                  [class.rp-brand-icon--success]="view() === 'success'">
        <mat-icon>{{ view() === 'success' ? 'check_circle' : view() === 'invalid' ? 'link_off' : 'lock_reset' }}</mat-icon>
      </div>
    </div>

    <!-- ── INVALID TOKEN ── -->
    @if (view() === 'invalid') {
      <div class="rp-body rp-body--center">
        <h1 class="rp-title">Link expired or invalid</h1>
        <p class="rp-subtitle">
          This password reset link is no longer valid. Links expire after 1 hour.
        </p>
        <a class="rp-btn rp-btn--outline" routerLink="/forgot-password">
          <mat-icon>refresh</mat-icon> Request a new link
        </a>
      </div>
    }

    <!-- ── FORM ── -->
    @if (view() === 'form') {
      <div class="rp-body">

        <h1 class="rp-title">Set a new password</h1>
        <p class="rp-subtitle">
          Choose a strong password — at least 8 characters with a mix of letters and numbers.
        </p>

        @if (errorMsg()) {
          <div class="rp-banner rp-banner--error">
            <mat-icon>error_outline</mat-icon>{{ errorMsg() }}
          </div>
        }

        <!-- New password -->
        <div class="rp-field" [class.rp-field--error]="touched && !newPassword">
          <label class="rp-label" for="rp-new">New password</label>
          <div class="rp-input-wrap">
            <mat-icon class="rp-input-icon">lock_outline</mat-icon>
            <input [id]="'rp-new'" class="rp-input"
                   [type]="showNew ? 'text' : 'password'"
                   placeholder="Min. 8 characters"
                   autocomplete="new-password"
                   [(ngModel)]="newPassword"
                   [disabled]="loading()"/>
            <button class="rp-eye" type="button" (click)="showNew = !showNew" tabindex="-1">
              <mat-icon>{{ showNew ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
          </div>
          @if (touched && !newPassword) {
            <span class="rp-field-error">Password is required.</span>
          }
          <!-- Strength bar -->
          @if (newPassword) {
            <div class="rp-strength">
              @for (seg of [0,1,2,3]; track seg) {
                <div class="rp-strength-seg"
                     [class.rp-strength-seg--active]="seg < strength()"
                     [style.background]="seg < strength() ? strengthColor() : undefined"></div>
              }
              <span class="rp-strength-label" [style.color]="strengthColor()">{{ strengthLabel() }}</span>
            </div>
          }
        </div>

        <!-- Confirm password -->
        <div class="rp-field" [class.rp-field--error]="touched && newPassword !== confirmPassword">
          <label class="rp-label" for="rp-confirm">Confirm new password</label>
          <div class="rp-input-wrap">
            <mat-icon class="rp-input-icon">lock_outline</mat-icon>
            <input [id]="'rp-confirm'" class="rp-input"
                   [type]="showConfirm ? 'text' : 'password'"
                   placeholder="Repeat your password"
                   autocomplete="new-password"
                   [(ngModel)]="confirmPassword"
                   (keydown.enter)="submit()"
                   [disabled]="loading()"/>
            <button class="rp-eye" type="button" (click)="showConfirm = !showConfirm" tabindex="-1">
              <mat-icon>{{ showConfirm ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
          </div>
          @if (touched && newPassword && newPassword !== confirmPassword) {
            <span class="rp-field-error">Passwords don't match.</span>
          }
        </div>

        <button class="rp-btn" (click)="submit()" [disabled]="loading()">
          @if (loading()) {
            <mat-spinner diameter="18" class="rp-btn-spinner"/>
            Updating…
          } @else {
            <mat-icon>check</mat-icon>
            Update password
          }
        </button>

        <a class="rp-back" routerLink="/login">
          <mat-icon>arrow_back</mat-icon> Back to sign in
        </a>

      </div>
    }

    <!-- ── SUCCESS ── -->
    @if (view() === 'success') {
      <div class="rp-body rp-body--center">
        <h1 class="rp-title">Password updated!</h1>
        <p class="rp-subtitle">Your password has been changed. You can now sign in with your new password.</p>
        <a class="rp-btn" routerLink="/login">
          <mat-icon>login</mat-icon> Go to sign in
        </a>
      </div>
    }

  </div>
</div>
  `,
  styles: [`
    .rp-wrap {
      min-height: 100vh;
      display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0fdf4 100%);
      padding: 24px;
    }
    .rp-card {
      width: 100%; max-width: 420px;
      background: #fff; border-radius: 20px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 8px 40px rgba(99,102,241,.1);
      padding: 40px 36px 36px;
      animation: rp-in .3s cubic-bezier(.16,1,.3,1);
    }
    @keyframes rp-in {
      from { opacity: 0; transform: translateY(18px) scale(.98); }
      to   { opacity: 1; transform: none; }
    }

    /* Brand */
    .rp-brand { display: flex; justify-content: center; margin-bottom: 28px; }
    .rp-brand-icon {
      width: 56px; height: 56px; border-radius: 16px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 16px rgba(99,102,241,.35);
      transition: background .3s;
      mat-icon { color: #fff; font-size: 26px; width: 26px; height: 26px; }
    }
    .rp-brand-icon--error   { background: linear-gradient(135deg,#f87171,#ef4444); box-shadow: 0 4px 16px rgba(239,68,68,.3); }
    .rp-brand-icon--success { background: linear-gradient(135deg,#34d399,#10b981); box-shadow: 0 4px 16px rgba(16,185,129,.3); }

    /* Body */
    .rp-body { display: flex; flex-direction: column; gap: 18px; }
    .rp-body--center { align-items: center; text-align: center; }

    .rp-title    { margin:0; font-size:1.35rem; font-weight:800; color:#1e293b; letter-spacing:-.02em; }
    .rp-subtitle { margin:0; font-size:.9rem; color:#64748b; line-height:1.6; }

    /* Banner */
    .rp-banner {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 14px; border-radius: 10px; font-size: .85rem; font-weight: 500;
      mat-icon { font-size:17px; width:17px; height:17px; flex-shrink:0; }
    }
    .rp-banner--error { background:#fef2f2; border:1px solid #fecaca; color:#dc2626; }

    /* Fields */
    .rp-field { display:flex; flex-direction:column; gap:5px; }
    .rp-label {
      font-size:.75rem; font-weight:700; text-transform:uppercase;
      letter-spacing:.06em; color:#475569;
    }
    .rp-input-wrap {
      display:flex; align-items:center;
      border:1.5px solid #e2e8f0; border-radius:11px; overflow:hidden;
      transition:border-color .2s, box-shadow .2s; background:#f8fafc;
    }
    .rp-field--error .rp-input-wrap { border-color:#f87171; }
    .rp-input-wrap:focus-within {
      border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,.12); background:#fff;
    }
    .rp-input-icon {
      font-size:17px; width:17px; height:17px;
      padding:0 6px 0 12px; color:#94a3b8; pointer-events:none; flex-shrink:0;
    }
    .rp-input {
      flex:1; border:none; background:transparent; outline:none;
      padding:11px 4px; font-size:.9rem; color:#1e293b; font-family:inherit;
      &::placeholder { color:#cbd5e1; }
      &:disabled { opacity:.6; cursor:not-allowed; }
    }
    .rp-eye {
      background:none; border:none; cursor:pointer; padding:0 10px;
      color:#94a3b8; display:flex; align-items:center;
      mat-icon { font-size:18px; width:18px; height:18px; }
      &:hover { color:#6366f1; }
    }
    .rp-field-error { font-size:.75rem; color:#dc2626; }

    /* Strength bar */
    .rp-strength {
      display:flex; align-items:center; gap:4px; margin-top:2px;
    }
    .rp-strength-seg {
      flex:1; height:3px; border-radius:3px; background:#e2e8f0;
      transition:background .25s;
    }
    .rp-strength-label { font-size:.7rem; font-weight:700; margin-left:4px; min-width:40px; }

    /* Button */
    .rp-btn {
      display:flex; align-items:center; justify-content:center; gap:7px;
      width:100%; padding:12px;
      background:linear-gradient(135deg,#6366f1,#8b5cf6);
      color:#fff; border:none; border-radius:11px;
      font-size:.9rem; font-weight:700; cursor:pointer; text-decoration:none;
      box-shadow:0 4px 14px rgba(99,102,241,.4);
      transition:opacity .2s, transform .15s, box-shadow .2s;
      mat-icon { font-size:18px; width:18px; height:18px; }
      &:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 6px 20px rgba(99,102,241,.45); }
      &:disabled { opacity:.65; cursor:not-allowed; box-shadow:none; }
    }
    .rp-btn--outline {
      background:transparent; border:1.5px solid #6366f1; color:#6366f1; box-shadow:none;
      &:hover { background:#f0f4ff; box-shadow:none; }
    }
    .rp-btn-spinner { --mdc-circular-progress-active-indicator-color:#fff; }

    /* Back */
    .rp-back {
      display:inline-flex; align-items:center; gap:4px; justify-content:center;
      font-size:.85rem; font-weight:600; color:#6366f1; text-decoration:none;
      transition:opacity .15s;
      mat-icon { font-size:16px; width:16px; height:16px; }
      &:hover { opacity:.7; }
    }
  `],
})
export class ResetPasswordComponent implements OnInit {
  private authSvc = inject(AuthService);
  private route   = inject(ActivatedRoute);
  private router  = inject(Router);

  view     = signal<ViewState>('form');
  loading  = signal(false);
  errorMsg = signal('');
  touched  = false;

  newPassword     = '';
  confirmPassword = '';
  showNew         = false;
  showConfirm     = false;

  private token = '';
  private email = '';

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'] ?? '';
    this.email = this.route.snapshot.queryParams['email'] ?? '';
    if (!this.token || !this.email) this.view.set('invalid');
  }

  strength(): number {
    const p = this.newPassword;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8)        s++;
    if (/[A-Z]/.test(p))      s++;
    if (/[0-9]/.test(p))      s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  }

  strengthColor(): string {
    return ['#ef4444','#f97316','#eab308','#22c55e'][this.strength() - 1] ?? '#e2e8f0';
  }

  strengthLabel(): string {
    return ['Weak','Fair','Good','Strong'][this.strength() - 1] ?? '';
  }

  submit(): void {
    this.touched = true;
    if (!this.newPassword || this.newPassword !== this.confirmPassword) return;

    this.loading.set(true);
    this.errorMsg.set('');

    this.authSvc.resetPassword({
      token:              this.token,
      email:              this.email,
      newPassword:        this.newPassword,
      confirmNewPassword: this.confirmPassword,
    }).subscribe({
      next: res => {
        this.loading.set(false);
        if (res.success) {
          this.view.set('success');
        } else {
          // Expired / invalid token returned from backend
          if (res.message.toLowerCase().includes('invalid') || res.message.toLowerCase().includes('expired')) {
            this.view.set('invalid');
          } else {
            this.errorMsg.set(res.message);
          }
        }
      },
      error: () => {
        this.loading.set(false);
        this.errorMsg.set('Something went wrong. Please try again.');
      },
    });
  }
}