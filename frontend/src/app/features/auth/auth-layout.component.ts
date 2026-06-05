import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, MatIconModule],
  template: `
    <div class="auth-wrapper">
      <div class="auth-brand">
        <div class="brand-icon">
          <mat-icon>work</mat-icon>
        </div>
        <h1>JobTracker</h1>
        <p>Your career journey, organized.</p>
      </div>
      <div class="auth-box">
        <router-outlet />
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/icon?family=Material+Icons');

    .auth-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a1f3a 0%, #3949ab 100%);
      padding: 24px;
      flex-direction: column;
      gap: 32px;
    }
    .auth-brand {
      text-align: center;
      color: white;
      .brand-icon {
        width: 64px; height: 64px;
        background: rgba(255,255,255,.15);
        border-radius: 20px;
        display: flex; align-items: center; justify-content: center;
        margin: 0 auto 12px;
        mat-icon { font-size: 32px; width: 32px; height: 32px; color: white; }
      }
      h1 { font-size: 2rem; font-weight: 700; letter-spacing: -0.02em; }
      p  { opacity: .7; margin-top: 4px; font-size: .95rem; }
    }
    .auth-box {
      background: white;
      border-radius: 20px;
      padding: 40px;
      width: 100%;
      max-width: 440px;
      box-shadow: 0 25px 60px rgba(0,0,0,.3);
    }
  `]
})
export class AuthLayoutComponent {}
