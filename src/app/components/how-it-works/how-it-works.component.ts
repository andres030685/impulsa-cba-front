import { Component, input } from '@angular/core';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  template: `
    <section class="how" aria-labelledby="how-title">
      <div class="how__content">
        <h2 class="how__title" id="how-title">Cómo funciona</h2>
        <div class="how__steps">
          @for (step of steps(); track step; let i = $index) {
            <div class="how__step">
              <div class="how__step-number">{{ i + 1 }}</div>
              <p class="how__step-text">{{ step }}</p>
            </div>
            @if (i < steps().length - 1) {
              <div class="how__connector"></div>
            }
          }
        </div>
      </div>
    </section>
  `,
  styleUrl: './how-it-works.component.scss',
})
export class HowItWorksComponent {
  steps = input.required<string[]>();
}
