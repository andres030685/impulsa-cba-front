import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { DiagnosticoService } from '../../services/diagnostico.service';
import { EventService } from '../../services/event.service';
import { PreguntaDiagnostico } from '../../models';

@Component({
  selector: 'app-diagnostico',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="diagnostico">
      <div class="diagnostico__content">
        @if (loading()) {
          <div class="diagnostico__loading">
            <div class="diagnostico__spinner"></div>
            <p>Preparando tu diagnóstico personalizado...</p>
          </div>
        } @else if (error()) {
          <div class="diagnostico__error">
            <p>{{ error() }}</p>
            <button class="diagnostico__btn diagnostico__btn--primary" (click)="iniciar()">
              Reintentar
            </button>
          </div>
        } @else if (preguntaActual()) {
          <!-- Progress bar -->
          <div class="diagnostico__progress">
            <div class="diagnostico__progress-bar">
              <div
                class="diagnostico__progress-fill"
                [style.width.%]="progreso()"
              ></div>
            </div>
            <span class="diagnostico__progress-text">
              Pregunta {{ indiceActual() + 1 }} de {{ preguntas().length }}
            </span>
          </div>

          <!-- Question card with animation -->
          <div class="diagnostico__card" [class.diagnostico__card--slide-in]="animating()">
            <h1 class="diagnostico__question">{{ preguntaActual()!.texto_pregunta }}</h1>

            @if (preguntaActual()!.tipo_pregunta === 'opcion_unica') {
              <div class="diagnostico__options">
                @for (opcion of preguntaActual()!.opciones; track opcion) {
                  <label
                    class="diagnostico__option"
                    [class.diagnostico__option--selected]="respuestaActual() === opcion"
                  >
                    <input
                      type="radio"
                      [name]="'pregunta-' + preguntaActual()!.id"
                      [value]="opcion"
                      [checked]="respuestaActual() === opcion"
                      (change)="seleccionarRespuesta(opcion)"
                    />
                    <span class="diagnostico__option-radio"></span>
                    <span>{{ opcion }}</span>
                  </label>
                }
              </div>
            } @else if (preguntaActual()!.tipo_pregunta === 'opcion_multiple') {
              <div class="diagnostico__options">
                @for (opcion of preguntaActual()!.opciones; track opcion) {
                  <label
                    class="diagnostico__option"
                    [class.diagnostico__option--selected]="seleccionadasMultiple().includes(opcion)"
                  >
                    <input
                      type="checkbox"
                      [checked]="seleccionadasMultiple().includes(opcion)"
                      (change)="toggleOpcionMultiple(opcion)"
                    />
                    <span class="diagnostico__option-check"></span>
                    <span>{{ opcion }}</span>
                  </label>
                }
              </div>
            } @else {
              <textarea
                class="diagnostico__textarea"
                [value]="respuestaActual()"
                (input)="seleccionarRespuesta($any($event.target).value)"
                placeholder="Escribí tu respuesta..."
                rows="4"
              ></textarea>
            }
          </div>

          <!-- Navigation -->
          <div class="diagnostico__nav">
            <button
              class="diagnostico__btn diagnostico__btn--secondary"
              [class.diagnostico__btn--hidden]="indiceActual() === 0"
              (click)="anterior()"
            >
              &larr; Anterior
            </button>

            @if (esUltima()) {
              <button
                class="diagnostico__btn diagnostico__btn--primary"
                [disabled]="!respuestaActual() || enviando()"
                (click)="finalizar()"
              >
                {{ enviando() ? 'Finalizando...' : 'Finalizar' }}
              </button>
            } @else {
              <button
                class="diagnostico__btn diagnostico__btn--primary"
                [disabled]="!respuestaActual() || enviando()"
                (click)="siguiente()"
              >
                {{ enviando() ? 'Enviando...' : 'Siguiente →' }}
              </button>
            }
          </div>

          @if (errorFinalizar()) {
            <p class="diagnostico__error-inline">{{ errorFinalizar() }}</p>
          }
        }
      </div>
    </section>
  `,
  styleUrl: './diagnostico.component.scss',
})
export class DiagnosticoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private diagnosticoService = inject(DiagnosticoService);
  private eventService = inject(EventService);

  private leadId = '';
  private sesionId = '';
  private enviadas = new Set<string>();

  preguntas = signal<PreguntaDiagnostico[]>([]);
  indiceActual = signal(0);
  respuestas = signal<Map<string, string>>(new Map());
  loading = signal(true);
  error = signal<string | null>(null);
  enviando = signal(false);
  animating = signal(false);
  errorFinalizar = signal<string | null>(null);

  preguntaActual = computed(() => {
    const p = this.preguntas();
    const i = this.indiceActual();
    return p.length > 0 ? p[i] : null;
  });

  respuestaActual = computed(() => {
    const pregunta = this.preguntaActual();
    if (!pregunta) return '';
    return this.respuestas().get(pregunta.id) ?? '';
  });

  progreso = computed(() => {
    const total = this.preguntas().length;
    if (total === 0) return 0;
    return ((this.indiceActual() + 1) / total) * 100;
  });

  seleccionadasMultiple = computed(() => {
    const actual = this.respuestaActual();
    if (!actual) return [] as string[];
    return actual.split(', ').filter(Boolean);
  });

  esUltima = computed(() => {
    return this.indiceActual() === this.preguntas().length - 1;
  });

  ngOnInit(): void {
    this.leadId = this.route.snapshot.paramMap.get('leadId') ?? '';
    if (!this.leadId) {
      this.router.navigate(['/']);
      return;
    }
    this.iniciar();
  }

  async iniciar(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const { sesion_id, preguntas, respuestas_previas } = await this.diagnosticoService.iniciarDiagnostico(this.leadId);
      this.sesionId = sesion_id;

      const ordenadas = preguntas.sort((a, b) => a.orden - b.orden);

      if (ordenadas.length === 0) {
        this.error.set('No hay preguntas disponibles en este momento.');
        return;
      }

      this.preguntas.set(ordenadas);

      // Restore previous answers and jump to the first unanswered question
      if (respuestas_previas?.length > 0) {
        const prevMap = new Map<string, string>();
        const respondidas = new Set<string>();

        for (const r of respuestas_previas) {
          prevMap.set(r.pregunta_id, r.valor_respuesta);
          respondidas.add(r.pregunta_id);
          this.enviadas.add(r.pregunta_id);
        }

        this.respuestas.set(prevMap);

        const primeraSinResponder = ordenadas.findIndex((p) => !respondidas.has(p.id));
        this.indiceActual.set(primeraSinResponder === -1 ? ordenadas.length - 1 : primeraSinResponder);
      }

      this.eventService.track({
        lead_id: this.leadId,
        tipo_evento: 'diagnostico_iniciado',
        metadata: { total_preguntas: ordenadas.length, sesion_id, respuestas_previas: respuestas_previas?.length ?? 0 },
      });
    } catch (err) {
      if (err instanceof HttpErrorResponse && err.status === 400) {
        this.router.navigate(['/resultado', this.leadId], {
          state: { fromRedirect: true },
        });
        return;
      }
      this.error.set('No pudimos cargar las preguntas. Intentá de nuevo.');
    } finally {
      this.loading.set(false);
    }
  }

  toggleOpcionMultiple(opcion: string): void {
    const actual = this.respuestaActual();
    const seleccionadas = actual ? actual.split(', ').filter(Boolean) : [];
    const index = seleccionadas.indexOf(opcion);

    if (index === -1) {
      seleccionadas.push(opcion);
    } else {
      seleccionadas.splice(index, 1);
    }

    this.seleccionarRespuesta(seleccionadas.join(', '));
  }

  seleccionarRespuesta(valor: string): void {
    const pregunta = this.preguntaActual();
    if (!pregunta) return;

    this.respuestas.update((map) => {
      const updated = new Map(map);
      updated.set(pregunta.id, valor);
      return updated;
    });
  }

  private async enviarSiNecesario(pregunta: PreguntaDiagnostico, valor: string): Promise<void> {
    if (this.enviadas.has(pregunta.id)) return;

    await this.diagnosticoService.enviarRespuesta(this.leadId, this.sesionId, pregunta.id, valor);
    this.enviadas.add(pregunta.id);

    this.eventService.track({
      lead_id: this.leadId,
      tipo_evento: 'diagnostico_respuesta',
      metadata: { pregunta_id: pregunta.id, pregunta_orden: pregunta.orden },
    });
  }

  async siguiente(): Promise<void> {
    const pregunta = this.preguntaActual();
    const valor = this.respuestaActual();
    if (!pregunta || !valor) return;

    this.enviando.set(true);
    try {
      await this.enviarSiNecesario(pregunta, valor);
      this.transicionarA(this.indiceActual() + 1);
    } catch {
      // error is in DiagnosticoService.error signal
    } finally {
      this.enviando.set(false);
    }
  }

  anterior(): void {
    if (this.indiceActual() > 0) {
      this.transicionarA(this.indiceActual() - 1);
    }
  }

  async finalizar(): Promise<void> {
    const pregunta = this.preguntaActual();
    const valor = this.respuestaActual();
    if (!pregunta || !valor) return;

    this.enviando.set(true);
    this.errorFinalizar.set(null);
    try {
      await this.enviarSiNecesario(pregunta, valor);

      const resultado = await this.diagnosticoService.completar(this.leadId, this.sesionId);

      this.eventService.track({
        lead_id: this.leadId,
        tipo_evento: 'diagnostico_completado',
        metadata: { clasificacion: resultado.clasificacion },
      });

      this.router.navigate(['/resultado', this.leadId], {
        state: {
          clasificacion: resultado.clasificacion,
          insight: resultado.insight,
          mensaje_cierre: resultado.mensaje_cierre,
        },
      });
    } catch {
      this.errorFinalizar.set('No pudimos generar tu resultado. Intentá de nuevo en unos segundos.');
    } finally {
      this.enviando.set(false);
    }
  }

  private transicionarA(nuevoIndice: number): void {
    this.animating.set(true);
    setTimeout(() => {
      this.indiceActual.set(nuevoIndice);
      this.animating.set(false);
    }, 250);
  }
}
