import { Component, inject, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ClasificacionLead } from '../../models';

@Component({
  selector: 'app-resultado',
  standalone: true,
  imports: [DatePipe],
  template: `
    <section class="resultado">
      <div class="resultado__content">
        @if (resuelto()) {
          <!-- Lead ya fue contactado -->
          <div class="resultado__badge resultado__badge--resuelto">
            Ya estamos en contacto
          </div>

          <h1 class="resultado__title">Tu caso está en marcha</h1>

          <div class="resultado__insight">
            <p>{{ mensaje() }}</p>
          </div>

          @if (fechaResolucion()) {
            <p class="resultado__fecha">
              Fecha de contacto: {{ fechaResolucion() | date:'d/MM/yyyy' }}
            </p>
          }
        } @else {
          <!-- Diagnóstico completado (no resuelto aún) o recién finalizado -->
          <div class="resultado__badge" [class]="'resultado__badge--' + clasificacion()">
            {{ badgeTexto() }}
          </div>

          <h1 class="resultado__title">Tu diagnóstico está listo</h1>

          <div class="resultado__insight">
            <h2 class="resultado__section-title">Tu diagnóstico</h2>
            <p>{{ insight() }}</p>
          </div>

          @if (mensajeCierre()) {
            <div class="resultado__cierre">
              <h2 class="resultado__section-title">Próximos pasos</h2>
              <p>{{ mensajeCierre() }}</p>
            </div>
          }

          @if (mensaje()) {
            <p class="resultado__mensaje">{{ mensaje() }}</p>
          }
        }

        <button class="resultado__btn" (click)="goBack()">
          Volver al inicio
        </button>
      </div>
    </section>
  `,
  styleUrl: './resultado.component.scss',
})
export class ResultadoComponent {
  private router = inject(Router);

  clasificacion = signal<ClasificacionLead>('frio');
  insight = signal('');
  mensajeCierre = signal('');
  mensaje = signal('');
  resuelto = signal(false);
  fechaResolucion = signal('');

  badgeTexto = computed(() => {
    const map: Record<ClasificacionLead, string> = {
      caliente: 'Alta oportunidad de mejora',
      tibio: 'Oportunidad moderada',
      frio: 'Tu negocio va bien encaminado',
    };
    return map[this.clasificacion()];
  });

  constructor() {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state as Record<string, unknown> | undefined;

    if (!state) {
      this.router.navigate(['/']);
      return;
    }

    if (state['resuelto']) {
      this.resuelto.set(true);
      this.mensaje.set((state['mensaje'] as string) ?? '');
      if (state['fecha_resolucion']) {
        this.fechaResolucion.set(state['fecha_resolucion'] as string);
      }
      if (state['clasificacion']) {
        this.clasificacion.set(state['clasificacion'] as ClasificacionLead);
      }
      if (state['insight']) {
        this.insight.set(state['insight'] as string);
      }
    } else if (state['insight']) {
      if (state['clasificacion']) {
        this.clasificacion.set(state['clasificacion'] as ClasificacionLead);
      }
      this.insight.set(state['insight'] as string);
      if (state['mensaje_cierre']) {
        this.mensajeCierre.set(state['mensaje_cierre'] as string);
      }
      if (state['mensaje']) {
        this.mensaje.set(state['mensaje'] as string);
      }
    } else {
      this.router.navigate(['/']);
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
