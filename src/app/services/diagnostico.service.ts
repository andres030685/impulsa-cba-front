import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { PreguntaDiagnostico, RespuestaDiagnostico, DiagnosticoResultado } from '../models';
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

  async obtenerPreguntas(): Promise<PreguntaDiagnostico[]> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const res = await firstValueFrom(
        this.http.get<ApiResponse<PreguntaDiagnostico[]>>(`${environment.apiUrl}/diagnostico/preguntas`),
      );
      return res.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al obtener las preguntas';
      this._error.set(message);
      throw err;
    } finally {
      this._loading.set(false);
    }
  }

  async enviarRespuesta(leadId: string, preguntaId: string, valor: string): Promise<RespuestaDiagnostico> {
    this._error.set(null);

    try {
      const res = await firstValueFrom(
        this.http.post<ApiResponse<RespuestaDiagnostico>>(
          `${environment.apiUrl}/diagnostico/${leadId}/respuestas`,
          { pregunta_id: preguntaId, valor_respuesta: valor },
        ),
      );
      return res.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al enviar la respuesta';
      this._error.set(message);
      throw err;
    }
  }

  async completar(leadId: string): Promise<DiagnosticoResultado> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const res = await firstValueFrom(
        this.http.post<ApiResponse<DiagnosticoResultado>>(
          `${environment.apiUrl}/diagnostico/${leadId}/completar`,
          {},
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
