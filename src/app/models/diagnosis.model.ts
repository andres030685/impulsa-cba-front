import { ClasificacionLead } from './lead.model';

export type TipoPregunta = 'opcion_unica' | 'texto_libre';

export interface PreguntaDiagnostico {
  id: string;
  texto_pregunta: string;
  tipo_pregunta: TipoPregunta;
  opciones: string[] | null;
  orden: number;
  activo: boolean;
}

export interface RespuestaDiagnostico {
  id: string;
  lead_id: string;
  pregunta_id: string;
  valor_respuesta: string;
  creado_en: string;
}

export interface DiagnosticoResultado {
  lead_id: string;
  total_respuestas: number;
  clasificacion?: ClasificacionLead;
  insight: string;
}
