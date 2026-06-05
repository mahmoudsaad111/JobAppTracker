import { Component, inject, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { ApplicationsService } from '../../../core/services/applications.service';
import { NotificationService } from '../../../core/services/notification.service';
import { APPLICATION_STATUSES } from '../../../core/models';

@Component({
  selector: 'app-application-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatDatepickerModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatCardModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div style="display:flex;align-items:center;gap:12px">
          <a mat-icon-button routerLink="/applications">
            <mat-icon>arrow_back</mat-icon>
          </a>
          <h1>{{ isEdit ? 'Edit Application' : 'New Application' }}</h1>
        </div>
      </div>

      <div class="app-card form-wrapper">
        @if (loadingData) {
          <div style="display:flex;justify-content:center;padding:60px">
            <mat-spinner diameter="40" />
          </div>
        } @else {
          <form [formGroup]="form" (ngSubmit)="submit()">
            <div class="form-grid">
              <mat-form-field appearance="outline">
                <mat-label>Company Name *</mat-label>
                <input matInput formControlName="CompanyName" placeholder="e.g. Google">
                <mat-icon matPrefix>business</mat-icon>
                @if (form.get('CompanyName')?.hasError('required') && form.get('CompanyName')?.touched) {
                  <mat-error>Company name is required</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Job Title *</mat-label>
                <input matInput formControlName="Title" placeholder="e.g. Frontend Developer">
                <mat-icon matPrefix>work</mat-icon>
                @if (form.get('Title')?.hasError('required') && form.get('Title')?.touched) {
                  <mat-error>Job title is required</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Location *</mat-label>
                <input matInput formControlName="Location" placeholder="e.g. London, UK / Remote">
                <mat-icon matPrefix>location_on</mat-icon>
                @if (form.get('Location')?.hasError('required') && form.get('Location')?.touched) {
                  <mat-error>Location is required</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Status *</mat-label>
                <mat-select formControlName="Status">
                  @for (s of Statuses; track s) {
                    <mat-option [value]="s">{{ s }}</mat-option>
                  }
                </mat-select>
                <mat-icon matPrefix>flag</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Application Date *</mat-label>
                <input matInput [matDatepicker]="picker" formControlName="ApplicationDate">
                <mat-icon matPrefix>calendar_today</mat-icon>
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
                @if (form.get('ApplicationDate')?.hasError('required') && form.get('ApplicationDate')?.touched) {
                  <mat-error>Date is required</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Job Link (optional)</mat-label>
                <input matInput formControlName="Link" placeholder="https://…">
                <mat-icon matPrefix>link</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Description (optional)</mat-label>
                <textarea matInput formControlName="Description" rows="4"
                  placeholder="Recruiter contact, salary expectations, preparation Description…"></textarea>
                <mat-icon matPrefix>Description</mat-icon>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <a mat-stroked-button routerLink="/applications">Cancel</a>
              <button mat-flat-button color="primary" type="submit" [disabled]="loading">
                @if (loading) { <mat-spinner diameter="18" /> }
                @else { {{ isEdit ? 'Save Changes' : 'Add Application' }} }
              </button>
            </div>
          </form>
        }
      </div>
    </div>
  `,
  styles: [`
    .form-wrapper { padding: 32px; max-width: 800px; }
    .form-actions {
      display: flex; justify-content: flex-end; gap: 12px;
      margin-top: 24px; padding-top: 24px;
      border-top: 1px solid var(--border);
    }
  `]
})
export class ApplicationFormComponent implements OnInit {
  @Input() id?: string;

  private fb     = inject(FormBuilder);
  private svc    = inject(ApplicationsService);
  private router = inject(Router);
  private notify = inject(NotificationService);

  Statuses    = APPLICATION_STATUSES;
  loading     = false;
  loadingData = false;
  isEdit      = false;

  form = this.fb.nonNullable.group({
    CompanyName:     ['', Validators.required],
    Title:           ['', Validators.required],
    Location:        ['', Validators.required],
    Status:          ['Saved' as typeof APPLICATION_STATUSES[number], Validators.required],
    ApplicationDate: [new Date(), Validators.required],
    Link:            [''],
    Description:     ['']
  });

  ngOnInit(): void {
    if (this.id) {
      this.isEdit      = true;
      this.loadingData = true;
      this.svc.getById(this.id).subscribe({
        next: res => {
          const a = res.data;
          this.form.patchValue({
            CompanyName:     a.companyName,
            Title:           a.title,
            Location:        a.location,
            Status:          a.status,
            ApplicationDate: new Date(a.appliedAt),
            Link:            a.jobLink     ?? '',
            Description:     a.description ?? '',
          });
          this.loadingData = false;
        },
        error: () => { this.loadingData = false; this.router.navigate(['/applications']); }
      });
    }
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.loading = true;
    const raw    = this.form.getRawValue();
    const body   = {
      CompanyName:     raw.CompanyName,
      Title:           raw.Title,
      Location:        raw.Location,
      Status:          raw.Status,
      ApplicationDate: raw.ApplicationDate as Date,
      JobLink:            raw.Link,
      Description:     raw.Description,
    };


    const obs = this.isEdit
      ? this.svc.update(this.id!, body)
      : this.svc.create(body);

    obs.subscribe({
      next: () => {
        this.notify.success(this.isEdit ? 'Application updated.' : 'Application added!');
        this.router.navigate(['/applications']);
      },
      error: () => { this.loading = false; }
    });
  }
}