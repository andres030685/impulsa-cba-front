import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TrackEventRequest } from '../models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EventService {
  private http = inject(HttpClient);

  track(event: TrackEventRequest): void {
    this.http
      .post(`${environment.apiUrl}/eventos`, event)
      .subscribe({
        error: (err) => console.warn('[Event tracking error]', err),
      });
  }
}
