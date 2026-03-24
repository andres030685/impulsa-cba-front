import { Component, inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';

interface FaqItem {
  pregunta: string;
  respuesta: string;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  template: `
    <section class="faq" aria-labelledby="faq-title">
      <div class="faq__content">
        <h2 class="faq__title" id="faq-title">Preguntas frecuentes</h2>
        <dl class="faq__list">
          @for (item of faqs; track item.pregunta) {
            <div class="faq__item">
              <dt class="faq__question">{{ item.pregunta }}</dt>
              <dd class="faq__answer">{{ item.respuesta }}</dd>
            </div>
          }
        </dl>
      </div>
    </section>
  `,
  styleUrl: './faq.component.scss',
})
export class FaqComponent implements OnInit {
  private document = inject(DOCUMENT);

  faqs: FaqItem[] = [
    {
      pregunta: '¿Qué tipo de negocios atienden?',
      respuesta:
        'Trabajamos con pymes y negocios de Córdoba que quieren ordenar su operación, captar más clientes o automatizar tareas repetitivas. Comercios, servicios profesionales, gastronomía, salud y más.',
    },
    {
      pregunta: '¿Qué incluye el diagnóstico gratuito?',
      respuesta:
        'Analizamos cómo funciona tu negocio hoy: qué herramientas usás, dónde perdés tiempo y qué oportunidades de mejora hay. Te damos un informe concreto con propuestas de implementación.',
    },
    {
      pregunta: '¿Necesito conocimientos técnicos?',
      respuesta:
        'No. Nosotros nos encargamos de todo: desde elegir las herramientas hasta implementarlas y capacitar a tu equipo. Vos seguís enfocado en tu negocio.',
    },
    {
      pregunta: '¿Cuánto tiempo tarda una implementación?',
      respuesta:
        'Depende del alcance, pero la mayoría de las implementaciones iniciales se completan en 2 a 4 semanas. Empezamos por lo que más impacto genera en tu operación.',
    },
    {
      pregunta: '¿Qué tecnologías implementan?',
      respuesta:
        'CRMs, sistemas de gestión, automatización de WhatsApp, dashboards de datos, facturación electrónica y herramientas con inteligencia artificial. Elegimos lo que mejor se adapte a tu caso.',
    },
  ];

  ngOnInit(): void {
    this.insertFaqSchema();
  }

  private insertFaqSchema(): void {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: this.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.pregunta,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.respuesta,
        },
      })),
    };

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'faq-schema';
    script.textContent = JSON.stringify(schema);
    this.document.head.appendChild(script);
  }
}
