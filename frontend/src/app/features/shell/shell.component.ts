import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../../core/services/auth.service';

interface NavItem {
  label: string;
  icon:  string;
  route: string;
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule, RouterOutlet, RouterLink, RouterLinkActive,
    MatIconModule, MatButtonModule, MatTooltipModule, MatMenuModule, MatBadgeModule
  ],
  template: `
    <div class="shell" [class.collapsed]="collapsed()">
      <!-- ── Sidebar ──────────────────────────────────────────────────────── -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="brand">
            <div class="brand-icon"><mat-icon>work</mat-icon></div>
            <span class="brand-name">JobTracker</span>
          </div>
          <button mat-icon-button class="collapse-btn" (click)="collapsed.set(!collapsed())">
            <mat-icon>{{ collapsed() ? 'menu' : 'menu_open' }}</mat-icon>
          </button>
        </div>

        <nav class="sidebar-nav">
          @for (item of navItems; track item.route) {
            <a class="nav-item"
               [routerLink]="item.route"
               routerLinkActive="active"
               [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
               [matTooltip]="collapsed() ? item.label : ''"
               matTooltipPosition="right">
              <mat-icon>{{ item.icon }}</mat-icon>
              <span class="nav-label">{{ item.label }}</span>
            </a>
          }
        </nav>

        <div class="sidebar-footer">
          <a class="nav-item" routerLink="/profile" routerLinkActive="active"
             [matTooltip]="collapsed() ? 'Profile' : ''" matTooltipPosition="right">
            <mat-icon>account_circle</mat-icon>
            <span class="nav-label">Profile</span>
          </a>
          <button class="nav-item logout" (click)="auth.logout()"
                  [matTooltip]="collapsed() ? 'Logout' : ''" matTooltipPosition="right">
            <mat-icon>logout</mat-icon>
            <span class="nav-label">Logout</span>
          </button>
        </div>
      </aside>

      <!-- ── Main ─────────────────────────────────────────────────────────── -->
      <div class="main-content">
        <header class="topbar">
          <div class="topbar-left">
            <button mat-icon-button class="mobile-menu" (click)="collapsed.set(!collapsed())">
              <mat-icon>menu</mat-icon>
            </button>
          </div>
          <div class="topbar-right">
            <button mat-icon-button [matMenuTriggerFor]="userMenu">
              <div class="avatar">{{ initials }}</div>
            </button>
            <mat-menu #userMenu="matMenu" xPosition="before">
              <div class="user-info-menu">
                <div class="uname">{{ auth.userName() }}</div>
                <div class="uemail">{{ auth.userEmail() }}</div>
              </div>
              <button mat-menu-item routerLink="/profile">
                <mat-icon>account_circle</mat-icon> Profile
              </button>
              <button mat-menu-item (click)="auth.logout()">
                <mat-icon>logout</mat-icon> Logout
              </button>
            </mat-menu>
          </div>
        </header>

        <main class="content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .shell {
      display: flex; height: 100vh; overflow: hidden;
    }

    /* ── Sidebar ── */
    .sidebar {
      width: 240px; min-width: 240px;
      background: var(--bg-sidebar);
      display: flex; flex-direction: column;
      transition: width .25s ease, min-width .25s ease;
      overflow: hidden;
    }
    .shell.collapsed .sidebar { width: 64px; min-width: 64px; }

    .sidebar-header {
      padding: 16px 12px;
      display: flex; align-items: center; justify-content: space-between;
      border-bottom: 1px solid rgba(255,255,255,.08);
      min-height: 64px;
    }
    .brand { display: flex; align-items: center; gap: 10px; overflow: hidden; }
    .brand-icon {
      width: 36px; height: 36px; min-width: 36px;
      background: var(--primary); border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      mat-icon { font-size: 20px; width: 20px; height: 20px; color: white; }
    }
    .brand-name { color: white; font-weight: 700; font-size: 1.1rem; white-space: nowrap; }
    .collapse-btn { color: rgba(255,255,255,.5); }
    .shell.collapsed .brand-name { opacity: 0; width: 0; }

    .sidebar-nav { flex: 1; padding: 12px 8px; display: flex; flex-direction: column; gap: 2px; }
    .sidebar-footer { padding: 12px 8px; border-top: 1px solid rgba(255,255,255,.08); display: flex; flex-direction: column; gap: 2px; }

    .nav-item {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 12px; border-radius: 10px;
      color: rgba(255,255,255,.65);
      cursor: pointer; text-decoration: none;
      transition: background .15s, color .15s;
      border: none; background: none; font-size: .9rem; font-family: inherit;
      white-space: nowrap; overflow: hidden;

      mat-icon { font-size: 20px; width: 20px; height: 20px; min-width: 20px; }
      .nav-label { overflow: hidden; }

      &:hover { background: rgba(255,255,255,.08); color: white; }
      &.active { background: rgba(255,255,255,.12); color: white; }
      &.logout:hover { background: rgba(244,67,54,.2); color: #ef9a9a; }
    }
    .shell.collapsed .nav-label { opacity: 0; width: 0; }

    /* ── Main ── */
    .main-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

    .topbar {
      height: 64px; min-height: 64px;
      background: white; border-bottom: 1px solid var(--border);
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 24px;
    }
    .mobile-menu { display: none; }
    @media (max-width: 768px) { .mobile-menu { display: flex; } }

    .avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: var(--primary); color: white;
      font-size: .875rem; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
    }
    .user-info-menu { padding: 12px 16px; border-bottom: 1px solid #e5e7eb; margin-bottom: 4px; }
    .uname { font-weight: 600; font-size: .9rem; }
    .uemail { color: #6b7280; font-size: .8rem; }

    .content { flex: 1; overflow-y: auto; }
  `]
})
export class ShellComponent {
  auth      = inject(AuthService);
  collapsed = signal(false);

  navItems: NavItem[] = [
    { label: 'Dashboard',    icon: 'dashboard',    route: '/dashboard'    },
    { label: 'Applications', icon: 'work_outline', route: '/applications' },
    { label: 'Interviews',   icon: 'event',        route: '/interviews'   },
    { label: 'Notes',   icon: 'note_alt',        route: '/notes'   },
    {label: 'Documents',   icon: 'description',        route: '/documents'   },
  ];

  get initials(): string {
    const name = this.auth.userName();
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';
  }
}
