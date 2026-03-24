import { Component, inject, OnDestroy } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  template: `
    <section class="confirmation">
      <div class="confirmation__content">
        <div class="confirmation__icon">&#10003;</div>
        <h1 class="confirmation__title">¡Listo!</h1>
        <p class="confirmation__text">
          Te hacemos un diagnóstico rápido por WhatsApp.
          <br />Tocá el botón para iniciar la conversación.
        </p>
        <a
          class="confirmation__wa-button"
          [href]="whatsappUrl"
          target="_blank"
          rel="noopener noreferrer"
          (click)="onWhatsappClick()"
        >
          Ir a WhatsApp
        </a>
        <button class="confirmation__back" (click)="goBack()">
          Volver al inicio
        </button>
      </div>
    </section>
  `,
  styleUrl: './confirmation.component.scss',
})
export class ConfirmationComponent implements OnDestroy {
  private router = inject(Router);
  private eventService = inject(EventService);
  private meta = inject(Meta);

  whatsappUrl: string = '#';
  private leadId: string = '';

  constructor() {
    this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
    this.meta.updateTag({ name: 'description', content: 'Confirmación de solicitud de diagnóstico — Impulsa Cba' });

    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state as { leadId: string; whatsappUrl: string } | undefined;

    if (state) {
      this.whatsappUrl = state.whatsappUrl;
      this.leadId = state.leadId;
    } else {
      this.router.navigate(['/']);
    }
  }

  ngOnDestroy(): void {
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    this.meta.updateTag({ name: 'description', content: 'Ordenamos negocios, automatizamos tareas y mejoramos resultados con tecnología aplicada. Diagnóstico gratuito para tu negocio en Córdoba.' });
  }

  onWhatsappClick(): void {
    this.eventService.track({
      lead_id: this.leadId,
      tipo_evento: 'whatsapp_click',
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
