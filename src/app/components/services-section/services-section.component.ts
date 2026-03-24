import { Component, input } from '@angular/core';

@Component({
  selector: 'app-services-section',
  standalone: true,
  template: `
    <section class="services" aria-labelledby="services-title">
      <div class="services__content">
        <h2 class="services__title" id="services-title">Qué hacemos</h2>
        <ul class="services__grid" role="list">
          @for (item of items(); track item; let i = $index) {
            <li class="services__card">
              <span class="services__number" aria-hidden="true">{{ i + 1 }}</span>
              <h3 class="services__text">{{ item }}</h3>
            </li>
          }
        </ul>
      </div>
    </section>
  `,
  styleUrl: './services-section.component.scss',
})
export class ServicesSectionComponent {
  items = input.required<string[]>();
}
