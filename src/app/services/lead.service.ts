import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CrearLeadRequest, CrearLeadResponse } from '../models';
import { environment } from '../../environments/environment';

interface ApiResponse<T> {
  ok: boolean;
  data: T;
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class LeadService {
  private http = inject(HttpClient);

  private readonly _submitting = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _lastResponse = signal<CrearLeadResponse | null>(null);

  readonly submitting = this._submitting.asReadonly();
  readonly error = this._error.asReadonly();
  readonly lastResponse = this._lastResponse.asReadonly();

  async submitLead(data: CrearLeadRequest): Promise<CrearLeadResponse> {
    this._submitting.set(true);
    this._error.set(null);

    try {
      const res = await firstValueFrom(
        this.http.post<ApiResponse<CrearLeadResponse>>(`${environment.apiUrl}/leads`, data),
      );
      this._lastResponse.set(res.data);
      return res.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al enviar los datos';
      this._error.set(message);
      throw err;
    } finally {
      this._submitting.set(false);
    }
  }
}
