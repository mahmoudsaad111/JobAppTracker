import { Component, inject, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { ApplicationsService } from '../../../core/services/applications.service';
import { InterviewsService } from '../../../core/services/interviews.service';
import { NotificationService } from '../../../core/services/notification.service';
import { JobApplication, Interview, APPLICATION_STATUSES, INTERVIEW_TYPES } from '../../../core/models';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-application-detail',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule,
    MatButtonModule, MatIconModule, MatSelectModule,
    MatFormFieldModule, MatInputModule, MatDatepickerModule,
    MatProgressSpinnerModule, MatChipsModule
  ],
  template: `
    <div class="page-container">
      @if (loading) {
        <div style="display:flex;justify-content:center;padding:80px"><mat-spinner diameter="48"/></div>
      } @else if (app) {

        <!-- Header -->
        <div class="page-header">
          <div style="display:flex;align-items:center;gap:12px">
            <a mat-icon-button routerLink="/applications"><mat-icon>arrow_back</mat-icon></a>
            <div>
              <h1>{{ app.title }}</h1>
              <p class="text-muted">{{ app.companyName }} · {{ app.location }}</p>
            </div>
          </div>
          <div style="display:flex;gap:8px">
            <a mat-stroked-button [routerLink]="['/applications', app.jobAppId, 'edit']">
              <mat-icon>edit</mat-icon> Edit
            </a>
            <button mat-stroked-button color="warn" (click)="deleteApp()">
              <mat-icon>delete</mat-icon> Delete
            </button>
          </div>
        </div>

        <div class="detail-grid">
          <!-- Left: Info + Status + Notes -->
          <div class="left-col">
            <!-- Status Card -->
            <div class="app-card info-card">
              <h3>Quick Update Status</h3>
              <div class="status-row">
                @for (s of statuses; track s) {
                  <button class="status-pill {{ s }}"
                    [class.active]="app.status === s"
                    (click)="changeStatus(s)">
                    {{ s }}
                  </button>
                }
              </div>
            </div>

            <!-- Details -->
            <div class="app-card info-card">
              <h3>Application Details</h3>
              <div class="detail-list">
                <div class="detail-row">
                  <mat-icon>business</mat-icon>
                  <div><div class="dr-label">Company</div><div>{{ app.companyName }}</div></div>
                </div>
                <div class="detail-row">
                  <mat-icon>work</mat-icon>
                  <div><div class="dr-label">Job Title</div><div>{{ app.title }}</div></div>
                </div>
                <div class="detail-row">
                  <mat-icon>location_on</mat-icon>
                  <div><div class="dr-label">Location</div><div>{{ app.location }}</div></div>
                </div>
                <div class="detail-row">
                  <mat-icon>calendar_today</mat-icon>
                  <div>
                    <div class="dr-label">Applied</div>
                    <div>{{ app.appliedAt | date:'MMMM d, y' }}</div>
                  </div>
                </div>
                @if (app.jobLink) {
                  <div class="detail-row">
                    <mat-icon>link</mat-icon>
                    <div>
                      <div class="dr-label">Job Link</div>
                      <a [href]="app.jobLink" target="_blank" rel="noopener">View Job Posting</a>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Description -->
            <div class="app-card info-card">
              <h3>Description</h3>
              @if (app.description) {
                <p class="description-text">{{ app.description }}</p>
              } @else {
                <p class="text-muted">No description added yet.</p>
              }
            </div>
          </div>

          <!-- Right: Interviews -->
          <div class="right-col">
            <div class="app-card info-card">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
                <h3>Interviews ({{ app.interviews?.length ?? 0 }})</h3>
                <button mat-flat-button color="accent" (click)="showAddInterview = !showAddInterview">
                  <mat-icon>add</mat-icon> Add
                </button>
              </div>

              <!-- Add interview form -->
              @if (showAddInterview) {
                <form [formGroup]="interviewForm" (ngSubmit)="addInterview()" class="interview-form">

                  <mat-form-field appearance="outline" class="w-full">
                    <mat-label>Interview Date</mat-label>
                    <input matInput [matDatepicker]="dp" formControlName="interviewDate">
                    <mat-datepicker-toggle matSuffix [for]="dp"></mat-datepicker-toggle>
                    <mat-datepicker #dp></mat-datepicker>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="w-full">
                    <mat-label>Interview Type</mat-label>
                    <mat-select formControlName="interviewType">
                      @for (t of interviewTypes; track t) {
                        <mat-option [value]="t">{{ t }}</mat-option>
                      }
                    </mat-select>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="w-full">
                    <mat-label>Interviewer Name</mat-label>
                    <input matInput formControlName="interviewerName">
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="w-full">
                    <mat-label>Notes</mat-label>
                    <textarea matInput formControlName="note" rows="3"></textarea>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="w-full">
                    <mat-label>Feedback</mat-label>
                    <textarea matInput formControlName="feedback" rows="3"></textarea>
                  </mat-form-field>

                  <div style="display:flex;gap:8px;justify-content:flex-end">
                    <button mat-button type="button" (click)="showAddInterview = false">Cancel</button>
                    <button mat-flat-button color="primary" type="submit"
                            [disabled]="savingInterview || interviewForm.invalid">
                      @if (savingInterview) { <mat-spinner diameter="16"/> } @else { Save }
                    </button>
                  </div>

                </form>
              }

              <!-- Interviews list -->
              @if (app.interviews?.length) {
                @for (iv of app.interviews; track iv.interviewId) {
                  <div class="interview-item" (click)="openInterview(iv)"
                       role="button" tabindex="0" (keydown.enter)="openInterview(iv)">
                    <div class="iv-header">
                      <span class="iv-type">{{ iv.interviewType }}</span>
                      <button mat-icon-button
                              (click)="deleteInterview(iv); $event.stopPropagation()">
                        <mat-icon>delete_outline</mat-icon>
                      </button>
                    </div>
                    <div class="iv-date">
                      <mat-icon>event</mat-icon> {{ iv.interviewDate | date:'EEE, MMM d, y' }}
                    </div>
                    @if (iv.note) { <div class="iv-note">{{ iv.note }}</div> }
                    <div class="iv-hint"><mat-icon>chevron_right</mat-icon> View details</div>
                  </div>
                }
              } @else if (!showAddInterview) {
                <div class="empty-interviews">
                  <mat-icon>event_available</mat-icon>
                  <p>No interviews logged yet</p>
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .detail-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
      @media (max-width: 900px) { grid-template-columns: 1fr; }
    }
    .left-col, .right-col { display: flex; flex-direction: column; gap: 16px; }
    .info-card { padding: 20px; h3 { font-size: 1rem; font-weight: 600; margin-bottom: 16px; } }

    .status-row { display: flex; flex-wrap: wrap; gap: 8px; }
    .status-pill {
      padding: 6px 14px; border-radius: 20px; font-size: .8rem; font-weight: 600;
      border: 2px solid transparent; cursor: pointer; transition: all .15s;

      &.Draft              { background: #f3f4f6; color: #374151;  &.active, &:hover { border-color: #6b7280; } }
      &.Submitted          { background: #dbeafe; color: #1e40af;  &.active, &:hover { border-color: #1e40af; } }
      &.UnderReview        { background: #fef3c7; color: #92400e;  &.active, &:hover { border-color: #d97706; } }
      &.InterviewScheduled { background: #e0e7ff; color: #3730a3;  &.active, &:hover { border-color: #4f46e5; } }
      &.Interviewed        { background: #ede9fe; color: #5b21b6;  &.active, &:hover { border-color: #7c3aed; } }
      &.Accepted           { background: #d1fae5; color: #065f46;  &.active, &:hover { border-color: #059669; } }
      &.Rejected           { background: #fee2e2; color: #991b1b;  &.active, &:hover { border-color: #dc2626; } }
      &.Withdrawn          { background: #fce7f3; color: #9d174d;  &.active, &:hover { border-color: #db2777; } }
    }

    .detail-list { display: flex; flex-direction: column; gap: 14px; }
    .detail-row { display: flex; align-items: flex-start; gap: 12px;
      mat-icon { color: var(--text-secondary); margin-top: 2px; font-size: 18px; width: 18px; height: 18px; }
    }
    .dr-label { font-size: .75rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: .05em; margin-bottom: 2px; }
    .notes-text { color: var(--text-primary); line-height: 1.6; white-space: pre-wrap; }

    .interview-form { background: #f8f9fc; padding: 16px; border-radius: 10px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 8px; }

    .interview-item {
      border: 1px solid var(--border); border-radius: 10px; padding: 14px; margin-bottom: 10px;
      cursor: pointer; transition: border-color .18s, box-shadow .18s, transform .15s;
      position: relative;
      &:hover {
        border-color: var(--primary, #6366f1);
        box-shadow: 0 4px 14px rgba(99,102,241,.1);
        transform: translateY(-2px);
      }
    }
    .iv-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .iv-type { background: #e0e7ff; color: #3730a3; padding: 2px 10px; border-radius: 12px; font-size: .78rem; font-weight: 600; }
    .iv-date { display: flex; align-items: center; gap: 6px; font-size: .875rem; color: var(--text-secondary);
      mat-icon { font-size: 16px; width: 16px; height: 16px; }
    }
    .iv-note { margin-top: 8px; font-size: .875rem; color: var(--text-secondary); }
    .iv-hint {
      display: flex; align-items: center; gap: 2px; justify-content: flex-end;
      font-size: .75rem; color: var(--primary, #6366f1); margin-top: 8px; opacity: 0;
      transition: opacity .18s;
      mat-icon { font-size: 15px; width: 15px; height: 15px; }
    }
    .interview-item:hover .iv-hint { opacity: 1; }

    .empty-interviews { text-align: center; padding: 32px; color: var(--text-secondary);
      mat-icon { font-size: 40px; width: 40px; height: 40px; opacity: .3; }
    }
  `]
})
export class ApplicationDetailComponent implements OnInit {
  @Input() id!: string;

  private appSvc = inject(ApplicationsService);
  private ivSvc  = inject(InterviewsService);
  private notify = inject(NotificationService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private fb     = inject(FormBuilder);

  app:     JobApplication | null = null;
  loading  = true;
  statuses = APPLICATION_STATUSES;
  interviewTypes   = INTERVIEW_TYPES;
  showAddInterview = false;
  savingInterview  = false;

  interviewForm = this.fb.nonNullable.group({
    interviewDate:   [new Date(), Validators.required],
    interviewType:   ['Phone' as typeof INTERVIEW_TYPES[number], Validators.required],
    interviewerName: ['', Validators.required],
    note:            [''],
    feedback:        ['']
  });

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.appSvc.getById(this.id).subscribe({
      next: res  => { console.log(res); this.app = res.data; this.loading = false; },
      error: ()  => { this.loading = false; this.router.navigate(['/applications']); }
    });
  }

  /** Navigate to the interviews page and pre-select this interview */
  openInterview(iv: Interview): void {
    this.router.navigate(['/interviews'], { queryParams: { id: iv.interviewId } });
  }

  changeStatus(status: typeof APPLICATION_STATUSES[number]): void {
    if (!this.app || this.app.status === status) return;
    this.appSvc.updateStatus(this.app.jobAppId, status).subscribe({
      next: res => { this.app = res.data; this.notify.success(`Status updated to ${status}`); },
      error: ()  => { this.notify.error('Failed to update status.'); }
    });
  }

  addInterview(): void {
    if (this.interviewForm.invalid) return;
    this.savingInterview = true;
    const raw = this.interviewForm.getRawValue();
    this.ivSvc.create({
      JobAppId:       this.id,
      InterviewDate:  (raw.interviewDate as Date).toISOString(),
      InterviewType:  raw.interviewType,
      Note:           raw.note,
      Feedback:       raw.feedback,
      InterviewerName: raw.interviewerName
    }).subscribe({
      next: () => {
        this.notify.success('Interview added!');
        this.showAddInterview = false;
        this.savingInterview  = false;
        this.load();
      },
      error: () => { this.savingInterview = false; }
    });
  }

  deleteInterview(iv: Interview): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Delete Interview', message: 'Remove this interview?', confirmLabel: 'Delete' }
    });
    ref.afterClosed().subscribe(ok => {
      if (!ok) return;
      this.ivSvc.delete(iv.interviewId).subscribe({
        next: () => { this.notify.success('Interview removed.'); this.load(); },
        error: ()  => { this.notify.error('Failed to remove interview.'); }
      });
    });
  }

  deleteApp(): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Delete Application', message: `Delete application for ${this.app?.title}?`, confirmLabel: 'Delete' }
    });
    ref.afterClosed().subscribe(ok => {
      if (!ok) return;
      this.appSvc.delete(this.id).subscribe({
        next: () => { this.notify.success('Application deleted.'); this.router.navigate(['/applications']); }
      });
    });
  }
}