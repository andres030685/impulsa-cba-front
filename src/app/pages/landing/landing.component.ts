import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { ProblemComponent } from '../../components/problem/problem.component';
import { ServicesSectionComponent } from '../../components/services-section/services-section.component';
import { HowItWorksComponent } from '../../components/how-it-works/how-it-works.component';
import { LeadFormComponent } from '../../components/lead-form/lead-form.component';
import { FaqComponent } from '../../components/faq/faq.component';
import { LeadService } from '../../services/lead.service';
import { EventService } from '../../services/event.service';
import { CrearLeadRequest } from '../../models';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    HeaderComponent,
    HeroComponent,
    ProblemComponent,
    ServicesSectionComponent,
    HowItWorksComponent,
    FaqComponent,
    LeadFormComponent,
  ],
  template: `
    <app-header (ctaClick)="scrollToForm('header')" />

    <main>
    <app-hero
      [title]="contenido.hero.titulo"
      [subtitle]="contenido.hero.subtitulo"
      [ctaText]="contenido.hero.cta"
      (ctaClick)="scrollToForm('hero')"
    />

    <app-problem
      [text]="contenido.problema.texto"
      [bullets]="contenido.problema.puntos"
    />

    <app-services-section
      [items]="contenido.servicios.items"
    />

    <app-how-it-works
      [steps]="contenido.comoFunciona.pasos"
    />

    <app-faq />

    <app-lead-form
      [isSubmitting]="sendingLead()"
      (formSubmit)="onFormSubmit($event)"
    />
    </main>
  `,
  styles: [],
})
export class LandingComponent {
  private leadService = inject(LeadService);
  private eventService = inject(EventService);
  private router = inject(Router);

  sendingLead = signal(false);

  contenido = {
    hero: {
      titulo: 'Te ayudamos a vender más y trabajar mejor con tecnología simple',
      subtitulo: 'Si tu negocio funciona pero está desordenado, te ayudamos a ordenarlo, automatizarlo y mejorar resultados.',
      cta: 'Analizar mi negocio',
    },
    problema: {
      texto: 'Trabajás mucho y hay tareas que podrías delegar para liberar tu tiempo. Es probable que estés perdiendo tiempo, control y oportunidades para abarcar más con menos esfuerzo.',
      puntos: [
        'No sabés cuánto ganás realmente',
        'No tenés seguimiento de clientes',
        'Todo depende de vos',
        'No hay un sistema claro',
      ],
    },
    servicios: {
      items: [
        'Ordenamos la operación',
        'Mejoramos la captación de clientes',
        'Automatizamos tareas repetitivas',
        'Mostramos datos claros para decidir',
      ],
    },
    comoFunciona: {
      pasos: [
        'Analizamos tu negocio',
        'Detectamos problemas',
        'Proponemos mejoras concretas',
        'Implementamos el sistema',
      ],
    },
  };

  constructor() {
    this.eventService.track({
      tipo_evento: 'pagina_vista',
    });
  }

  scrollToForm(source: string): void {
    this.eventService.track({
      tipo_evento: 'cta_click',
      metadata: { source },
    });

    document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' });
  }

  async onFormSubmit(data: CrearLeadRequest): Promise<void> {
    this.sendingLead.set(true);
    try {
      const response = await this.leadService.submitLead(data);

      this.eventService.track({
        lead_id: response.lead_id,
        tipo_evento: 'formulario_enviado',
      });

      this.router.navigate(['/diagnostico', response.lead_id]);
    } catch {
      this.sendingLead.set(false);
    }
  }
}
