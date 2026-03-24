import { ClasificacionLead } from './lead.model';

export type TipoPregunta = 'opcion_unica' | 'opcion_multiple' | 'texto_libre';

export interface PreguntaDiagnostico {
  id: string;
  texto_pregunta: string;
  tipo_pregunta: TipoPregunta;
  opciones: string[] | null;
  orden: number;
}

export interface RespuestaPrevia {
  pregunta_id: string;
  valor_respuesta: string;
  respondido_en: string;
}

export interface IniciarDiagnosticoResponse {
  sesion_id: string;
  preguntas: PreguntaDiagnostico[];
  respuestas_previas: RespuestaPrevia[];
}

export interface EnviarRespuestaResponse {
  recibida: boolean;
  respuestas_enviadas: number;
  total_preguntas: number;
}

export interface DiagnosticoResultado {
  lead_id: string;
  total_respuestas: number;
  clasificacion?: ClasificacionLead;
  insight: string;
  mensaje_cierre?: string;
}

export interface DiagnosticoCompletadoResponse {
  diagnostico_completado: true;
  resuelto: boolean;
  fecha_resolucion?: string;
  clasificacion: ClasificacionLead;
  insight: string;
  mensaje_cierre: string;
  mensaje: string;
}

export type IniciarResponse = IniciarDiagnosticoResponse | DiagnosticoCompletadoResponse;

export function isDiagnosticoCompletado(data: IniciarResponse): data is DiagnosticoCompletadoResponse {
  return 'diagnostico_completado' in data && data.diagnostico_completado === true;
}
