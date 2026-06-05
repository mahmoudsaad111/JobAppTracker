import { Injectable, inject } from '@angular/core';
import { HttpClient }         from '@angular/common/http';
import { map }                from 'rxjs/operators';
import { environment }        from '../../../environments/environment';

export interface NoteDto {
  noteId:    string;
  content:   string;
  createdAt: Date;
  updatedAt: Date;
}

// Matches actual backend response: { data: { notes: NoteDto[] } }
interface GetAllNotesResponse {
  data: { notes: NoteDto[] };
  message: string;
  success: boolean;
}

interface SingleNoteResponse {
  data: NoteDto;
  message: string;
  success: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotesService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/notes`;

  /** Returns a flat NoteDto[] regardless of the wrapper shape */
  getAll() {
    return this.http.get<GetAllNotesResponse>(this.base).pipe(
      map(res => {
        const inner = res?.data;
        // Handle { data: { notes: [] } }
        if (inner && Array.isArray((inner as any).notes))
          return (inner as any).notes as NoteDto[];
        // Fallback: already an array
        if (Array.isArray(inner)) return inner as NoteDto[];
        return [] as NoteDto[];
      })
    );
  }

  create(content: string) {
    return this.http.post<SingleNoteResponse>(this.base, { content });
  }

  update(id: string, content: string) {
    return this.http.put<SingleNoteResponse>(`${this.base}/${id}`, { content });
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}