import { Component, input } from '@angular/core';

@Component({
  selector: 'app-services-section',
  standalone: true,
  template: `
    <section class="services" aria-labelledby="services-title">
      <div class="services__content">
        <h2 class="services__title" id="services-title">Qué hacemos</h2>
        <div class="services__grid">
          @for (item of items(); track item; let i = $index) {
            <div class="services__card">
              <span class="services__number">{{ i + 1 }}</span>
              <p class="services__text">{{ item }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styleUrl: './services-section.component.scss',
})
export class ServicesSectionComponent {
  items = input.required<string[]>();
}
