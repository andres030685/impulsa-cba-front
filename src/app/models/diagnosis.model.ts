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
