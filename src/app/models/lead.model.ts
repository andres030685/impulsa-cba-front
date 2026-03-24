export type ObjetivoMejora =
  | 'mas_clientes'
  | 'ordenar'
  | 'automatizar'
  | 'entender_numeros';

export type TamanioEquipo =
  | 'solo'
  | '2_a_5'
  | '6_a_15'
  | 'mas_de_15';

export type EstadoLead =
  | 'capturado'
  | 'redirigido'
  | 'en_diagnostico'
  | 'diagnosticado'
  | 'clasificado'
  | 'contactado'
  | 'convertido'
  | 'perdido';

export type ClasificacionLead = 'caliente' | 'tibio' | 'frio';

export interface Lead {
  id: string;
  nombre: string;
  nombre_negocio: string;
  rubro: string;
  objetivos_mejora: ObjetivoMejora[];
  tamanio_equipo: TamanioEquipo;
  telefono: string;
  estado: EstadoLead;
  clasificacion: ClasificacionLead | null;
  origen: string | null;
  creado_en: string;
  actualizado_en: string;
}

export interface CrearLeadRequest {
  nombre: string;
  nombre_negocio: string;
  rubro: string;
  objetivos_mejora: ObjetivoMejora[];
  tamanio_equipo: TamanioEquipo;
  telefono: string;
}

export interface CrearLeadResponse {
  lead_id: string;
}
