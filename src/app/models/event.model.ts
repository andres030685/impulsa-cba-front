export type TipoEvento =
  | 'pagina_vista'
  | 'cta_click'
  | 'formulario_enviado'
  | 'whatsapp_click'
  | 'diagnostico_iniciado'
  | 'diagnostico_respuesta'
  | 'diagnostico_completado'
  | 'lead_clasificado'
  | 'lead_contactado'
  | 'lead_convertido'
  | 'lead_perdido';

export interface Evento {
  id: string;
  lead_id: string | null;
  tipo_evento: TipoEvento;
  metadata: Record<string, unknown>;
  creado_en: string;
}

export interface TrackEventRequest {
  lead_id?: string;
  tipo_evento: TipoEvento;
  metadata?: Record<string, unknown>;
}
