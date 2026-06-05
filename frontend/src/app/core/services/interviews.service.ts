import { Injectable, inject } from '@angular/core';
import { HttpClient }         from '@angular/common/http';
import { Observable }         from 'rxjs';
import { environment }        from '@env/environment';
import {
  Interview,
  CreateInterviewRequest,
  UpdateInterviewRequest,
  ApiResponse,
} from '../models';

@Injectable({ providedIn: 'root' })
export class InterviewsService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/Interview`;

  /** Returns all interviews for the current user, each with jobApplication populated */
  getAll(): Observable<ApiResponse<Interview[]>> {
    return this.http.get<ApiResponse<Interview[]>>(this.base);
  }

  getByApplication(applicationId: string): Observable<ApiResponse<Interview[]>> {
    return this.http.get<ApiResponse<Interview[]>>(`${this.base}/JobApp/${applicationId}`);
  }

  create(body: CreateInterviewRequest): Observable<ApiResponse<Interview>> {
    return this.http.post<ApiResponse<Interview>>(this.base, body);
  }

  update(id: string, body: UpdateInterviewRequest): Observable<ApiResponse<Interview>> {
    return this.http.put<ApiResponse<Interview>>(`${this.base}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}