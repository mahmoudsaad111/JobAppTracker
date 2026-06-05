import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { ApplicationsService } from '../../../core/services/applications.service';
import { NotificationService } from '../../../core/services/notification.service';
import { JobApplication, ApplicationStatus, APPLICATION_STATUSES } from '../../../core/models';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

// Map every status value → a stable CSS key (no spaces, all lowercase)
function statusKey(s: string): string {
  return s.toLowerCase().replace(/\s+/g, '');
}

@Component({
  selector: 'app-applications-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatMenuModule, MatDatepickerModule, MatNativeDateModule,
    MatProgressSpinnerModule, MatTooltipModule
  ],
  template: `
    <div class="page-container">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1>Applications</h1>
          <p class="text-muted">{{ total }} total applications</p>
        </div>
        <a mat-flat-button color="primary" routerLink="/applications/new">
          <mat-icon>add</mat-icon> New Application
        </a>
      </div>

      <!-- Filters -->
      <div class="app-card filters-card">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search</mat-label>
          <input matInput [formControl]="searchCtrl" placeholder="Company, title, location…">
          <mat-icon matPrefix>search</mat-icon>
          @if (searchCtrl.value) {
            <button matSuffix mat-icon-button (click)="searchCtrl.setValue('')">
              <mat-icon>close</mat-icon>
            </button>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="status-field">
          <mat-label>Status</mat-label>
          <mat-select [formControl]="statusCtrl">
            <mat-option value="">All Statuses</mat-option>
            @for (s of statuses; track s) {
              <mat-option [value]="s">{{ s }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="date-field">
          <mat-label>From Date</mat-label>
          <input matInput [matDatepicker]="fromPicker" [formControl]="fromDateCtrl" placeholder="MM/DD/YYYY">
          <mat-datepicker-toggle matSuffix [for]="fromPicker"/>
          <mat-datepicker #fromPicker/>
        </mat-form-field>

        <mat-form-field appearance="outline" class="date-field">
          <mat-label>To Date</mat-label>
          <input matInput [matDatepicker]="toPicker" [formControl]="toDateCtrl" placeholder="MM/DD/YYYY">
          <mat-datepicker-toggle matSuffix [for]="toPicker"/>
          <mat-datepicker #toPicker/>
        </mat-form-field>

        @if (fromDateCtrl.value || toDateCtrl.value) {
          <button mat-stroked-button (click)="clearDates()">
            <mat-icon>clear</mat-icon> Clear Dates
          </button>
        }
      </div>

      <!-- Table -->
      <div class="app-card table-card">
        @if (loading) {
          <div class="table-loading"><mat-spinner diameter="40"/></div>
        } @else if (applications.length === 0) {
          <div class="empty-table">
            <mat-icon>work_outline</mat-icon>
            <h3>No applications found</h3>
            <p>{{ searchCtrl.value || statusCtrl.value ? 'Try adjusting your filters.' : 'Start tracking your job search!' }}</p>
            @if (!searchCtrl.value && !statusCtrl.value) {
              <a mat-flat-button color="primary" routerLink="/applications/new">Add First Application</a>
            }
          </div>
        } @else {
          <table mat-table [dataSource]="applications" matSort (matSortChange)="onSort($event)">

            <!-- Company -->
            <ng-container matColumnDef="companyName">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Company</th>
              <td mat-cell *matCellDef="let row">
                <div class="company-cell">
                  <div class="co-avatar">{{ row.companyName[0] }}</div>
                  <div>
                    <div class="co-name">{{ row.companyName }}</div>
                    <div class="co-loc text-muted">{{ row.location }}</div>
                  </div>
                </div>
              </td>
            </ng-container>

            <!-- Job Title -->
            <ng-container matColumnDef="jobTitle">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Job Title</th>
              <td mat-cell *matCellDef="let row">{{ row.title }}</td>
            </ng-container>

            <!-- Status — use statusKey() helper for the CSS class -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Status</th>
              <td mat-cell *matCellDef="let row">
                <span class="status-chip" [ngClass]="'status--' + statusKey(row.status)">
                  {{ row.status }}
                </span>
              </td>
            </ng-container>

            <!-- Date -->
            <ng-container matColumnDef="applicationDate">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Applied</th>
              <td mat-cell *matCellDef="let row" class="text-muted">
                {{ row.appliedAt | date:'MMM d, y' }}
              </td>
            </ng-container>

            <!-- Interviews -->
            <ng-container matColumnDef="interviews">
              <th mat-header-cell *matHeaderCellDef>Interviews</th>
              <td mat-cell *matCellDef="let row">
                @if (row.interviews?.length) {
                  <span class="interview-badge">{{ row.interviews.length }}</span>
                } @else {
                  <span class="text-muted">—</span>
                }
              </td>
            </ng-container>

            <!-- Actions -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef></th>
              <td mat-cell *matCellDef="let row">
                <div class="row-actions">
                  <a mat-icon-button [routerLink]="['/applications', row.jobAppId]" matTooltip="View">
                    <mat-icon>visibility</mat-icon>
                  </a>
                  <a mat-icon-button [routerLink]="['/applications', row.jobAppId, 'edit']" matTooltip="Edit">
                    <mat-icon>edit</mat-icon>
                  </a>
                  <button mat-icon-button matTooltip="Delete" (click)="delete(row)">
                    <mat-icon>delete_outline</mat-icon>
                  </button>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns"></tr>
          </table>

          <mat-paginator
            [length]="total"
            [pageSize]="pageSize"
            [pageSizeOptions]="[10, 25, 50]"
            (page)="onPage($event)"
            showFirstLastButtons>
          </mat-paginator>
        }
      </div>
    </div>
  `,
  styles: [`
    .filters-card {
      display: flex; flex-wrap: wrap; gap: 12px;
      padding: 16px 20px; margin-bottom: 16px; align-items: center;
    }
    .search-field { flex: 1; min-width: 220px; }
    .status-field { width: 180px; }
    .date-field   { width: 160px; }

    .table-card { overflow: hidden; }
    .table-loading { display: flex; justify-content: center; padding: 60px; }
    .empty-table {
      text-align: center; padding: 60px 24px;
      mat-icon { font-size: 56px; width: 56px; height: 56px; color: #d1d5db; }
      h3 { margin: 12px 0 4px; font-size: 1.1rem; }
      p  { color: var(--text-secondary); margin-bottom: 20px; }
    }

    .company-cell { display: flex; align-items: center; gap: 10px; }
    .co-avatar {
      width: 36px; height: 36px; border-radius: 8px;
      background: linear-gradient(135deg, var(--primary-light), var(--primary));
      color: white; font-weight: 700; font-size: .875rem;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .co-name { font-weight: 500; }
    .co-loc  { font-size: .78rem; }

    /* ── Status chips ──────────────────────────────────────────────────────
       Class pattern: .status-chip.status--{statusKey(value)}
       statusKey() lowercases and strips spaces so:
         Draft              → status--draft
         Submitted          → status--submitted
         UnderReview        → status--underreview
         InterviewScheduled → status--interviewscheduled
         Interviewed        → status--interviewed
         Accepted           → status--accepted
         Rejected           → status--rejected
         Withdrawn          → status--withdrawn
    ──────────────────────────────────────────────────────────────────────── */
    .status-chip {
      display: inline-flex; align-items: center;
      padding: 3px 10px; border-radius: 20px;
      font-size: .75rem; font-weight: 700; white-space: nowrap;
      /* fallback — should never show if all statuses are mapped */
      background: #f3f4f6; color: #6b7280;
    }

    .status--draft              { background: #f3f4f6; color: #374151; }
    .status--submitted          { background: #dbeafe; color: #1e40af; }
    .status--underreview        { background: #fef3c7; color: #92400e; }
    .status--interviewscheduled { background: #e0e7ff; color: #3730a3; }
    .status--interviewed        { background: #ede9fe; color: #5b21b6; }
    .status--accepted           { background: #d1fae5; color: #065f46; }
    .status--rejected           { background: #fee2e2; color: #991b1b; }
    .status--withdrawn          { background: #fce7f3; color: #9d174d; }

    .interview-badge {
      display: inline-flex; align-items: center; justify-content: center;
      width: 22px; height: 22px; border-radius: 50%;
      background: #fef3c7; color: #92400e; font-size: .75rem; font-weight: 700;
    }

    .row-actions { display: flex; opacity: 0; transition: opacity .15s; }
    tr.mat-mdc-row:hover .row-actions { opacity: 1; }
  `]
})
export class ApplicationsListComponent implements OnInit, OnDestroy {
  private svc      = inject(ApplicationsService);
  private notify   = inject(NotificationService);
  private dialog   = inject(MatDialog);
  private destroy$ = new Subject<void>();

  applications: JobApplication[] = [];
  total    = 0;
  loading  = true;
  page     = 1;
  pageSize = 10;
  sortBy   = 'applicationDate';
  sortDir: 'asc' | 'desc' = 'desc';

  statuses = APPLICATION_STATUSES;
  columns  = ['companyName', 'jobTitle', 'status', 'applicationDate', 'interviews', 'actions'];

  searchCtrl   = new FormControl('');
  statusCtrl   = new FormControl<ApplicationStatus | ''>('');
  fromDateCtrl = new FormControl<Date | null>(null);
  toDateCtrl   = new FormControl<Date | null>(null);

  // expose helper to template
  readonly statusKey = statusKey;

  ngOnInit(): void {
    this.load();

    this.searchCtrl.valueChanges.pipe(
      debounceTime(350), distinctUntilChanged(), takeUntil(this.destroy$)
    ).subscribe(() => { this.page = 1; this.load(); });

    this.statusCtrl.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => { this.page = 1; this.load(); });

    this.fromDateCtrl.valueChanges.pipe(debounceTime(200), takeUntil(this.destroy$))
      .subscribe(() => { this.page = 1; this.load(); });

    this.toDateCtrl.valueChanges.pipe(debounceTime(200), takeUntil(this.destroy$))
      .subscribe(() => { this.page = 1; this.load(); });
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  load(): void {
    this.loading = true;
    this.svc.getAll({
      page:     this.page,
      pageSize: this.pageSize,
      search:   this.searchCtrl.value ?? '',
      status:   this.statusCtrl.value ?? '',
      fromDate: this.fromDateCtrl.value ?? undefined,
      toDate:   this.toDateCtrl.value   ?? undefined,
    }).subscribe({
      next: res => { this.applications = res.data; this.total = res.total; this.loading = false; },
      error: ()  => { this.loading = false; }
    });
  }

  onPage(e: PageEvent): void { this.page = e.pageIndex + 1; this.pageSize = e.pageSize; this.load(); }
  onSort(s: Sort): void { this.sortBy = s.active; this.sortDir = (s.direction as 'asc' | 'desc') || 'desc'; this.load(); }

  clearDates(): void { this.fromDateCtrl.setValue(null); this.toDateCtrl.setValue(null); }

  delete(app: JobApplication): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Delete Application', message: `Delete application for ${app.title} at ${app.companyName}?`, confirmLabel: 'Delete' }
    });
    ref.afterClosed().subscribe(ok => {
      if (!ok) return;
      this.svc.delete(app.jobAppId).subscribe({
        next: () => { this.notify.success('Application deleted.'); this.load(); },
        error: ()  => { this.notify.error('Failed to delete application.'); }
      });
    });
  }
}