import { Component, inject, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ClasificacionLead } from '../../models';

@Component({
  selector: 'app-resultado',
  standalone: true,
  template: `
    <section class="resultado">
      <div class="resultado__content">
        <div class="resultado__badge" [class]="'resultado__badge--' + clasificacion()">
          {{ badgeTexto() }}
        </div>

        <h1 class="resultado__title">Tu diagnóstico está listo</h1>

        <div class="resultado__insight">
          <p>{{ insight() }}</p>
        </div>

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
    const state = nav?.extras.state as {
      clasificacion: ClasificacionLead;
      insight: string;
    } | undefined;

    if (state?.insight) {
      if (state.clasificacion) {
        this.clasificacion.set(state.clasificacion);
      }
      this.insight.set(state.insight);
    } else {
      this.router.navigate(['/']);
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
