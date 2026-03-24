import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
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
            <p>Preparando tu diagnóstico...</p>
          </div>
        } @else if (error()) {
          <div class="diagnostico__error">
            <p>{{ error() }}</p>
            <button class="diagnostico__btn diagnostico__btn--primary" (click)="cargarPreguntas()">
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

  preguntas = signal<PreguntaDiagnostico[]>([]);
  indiceActual = signal(0);
  respuestas = signal<Map<string, string>>(new Map());
  loading = signal(true);
  error = signal<string | null>(null);
  enviando = signal(false);
  animating = signal(false);

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

  esUltima = computed(() => {
    return this.indiceActual() === this.preguntas().length - 1;
  });

  ngOnInit(): void {
    this.leadId = this.route.snapshot.paramMap.get('leadId') ?? '';
    if (!this.leadId) {
      this.router.navigate(['/']);
      return;
    }
    this.cargarPreguntas();
  }

  async cargarPreguntas(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const preguntas = await this.diagnosticoService.obtenerPreguntas();
      const activas = preguntas
        .filter((p) => p.activo)
        .sort((a, b) => a.orden - b.orden);

      if (activas.length === 0) {
        this.error.set('No hay preguntas disponibles en este momento.');
        return;
      }

      this.preguntas.set(activas);

      this.eventService.track({
        lead_id: this.leadId,
        tipo_evento: 'diagnostico_iniciado',
        metadata: { total_preguntas: activas.length },
      });
    } catch {
      this.error.set('No pudimos cargar las preguntas. Intentá de nuevo.');
    } finally {
      this.loading.set(false);
    }
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

  async siguiente(): Promise<void> {
    const pregunta = this.preguntaActual();
    const valor = this.respuestaActual();
    if (!pregunta || !valor) return;

    this.enviando.set(true);
    try {
      await this.diagnosticoService.enviarRespuesta(this.leadId, pregunta.id, valor);

      this.eventService.track({
        lead_id: this.leadId,
        tipo_evento: 'diagnostico_respuesta',
        metadata: { pregunta_id: pregunta.id, pregunta_orden: pregunta.orden },
      });

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
    try {
      await this.diagnosticoService.enviarRespuesta(this.leadId, pregunta.id, valor);

      this.eventService.track({
        lead_id: this.leadId,
        tipo_evento: 'diagnostico_respuesta',
        metadata: { pregunta_id: pregunta.id, pregunta_orden: pregunta.orden },
      });

      const resultado = await this.diagnosticoService.completar(this.leadId);

      this.eventService.track({
        lead_id: this.leadId,
        tipo_evento: 'diagnostico_completado',
        metadata: { clasificacion: resultado.clasificacion },
      });

      this.router.navigate(['/resultado', this.leadId], {
        state: {
          clasificacion: resultado.clasificacion,
          insight: resultado.insight,
        },
      });
    } catch {
      // error is in DiagnosticoService.error signal
    } finally {
      this.enviando.set(false);
    }
  }

  private transicionarA(nuevoIndice: number): void {
    this.animating.set(true);
    setTimeout(() => {
      this.indiceActual.set(nuevoIndice);
      this.animating.set(false);
    }, 200);
  }
}
