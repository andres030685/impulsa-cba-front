import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { IniciarDiagnosticoResponse, EnviarRespuestaResponse, DiagnosticoResultado } from '../models';
import { environment } from '../../environments/environment';

interface ApiResponse<T> {
  ok: boolean;
  data: T;
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class DiagnosticoService {
  private http = inject(HttpClient);

  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  async iniciarDiagnostico(leadId: string): Promise<IniciarDiagnosticoResponse> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const res = await firstValueFrom(
        this.http.post<ApiResponse<IniciarDiagnosticoResponse>>(
          `${environment.apiUrl}/diagnostico/${leadId}/iniciar`,
          {},
        ),
      );
      return res.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al iniciar el diagnóstico';
      this._error.set(message);
      throw err;
    } finally {
      this._loading.set(false);
    }
  }

  async enviarRespuesta(leadId: string, sesionId: string, preguntaId: string, valor: string): Promise<EnviarRespuestaResponse> {
    this._error.set(null);

    try {
      const res = await firstValueFrom(
        this.http.post<ApiResponse<EnviarRespuestaResponse>>(
          `${environment.apiUrl}/diagnostico/${leadId}/respuestas`,
          { sesion_id: sesionId, pregunta_id: preguntaId, valor_respuesta: valor },
        ),
      );
      return res.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al enviar la respuesta';
      this._error.set(message);
      throw err;
    }
  }

  async completar(leadId: string, sesionId: string): Promise<DiagnosticoResultado> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const res = await firstValueFrom(
        this.http.post<ApiResponse<DiagnosticoResultado>>(
          `${environment.apiUrl}/diagnostico/${leadId}/completar`,
          { sesion_id: sesionId },
        ),
      );
      return res.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al completar el diagnóstico';
      this._error.set(message);
      throw err;
    } finally {
      this._loading.set(false);
    }
  }
}
