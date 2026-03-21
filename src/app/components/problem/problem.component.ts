import { Component, input } from '@angular/core';

@Component({
  selector: 'app-problem',
  standalone: true,
  template: `
    <section class="problem" aria-label="Problemas comunes">
      <div class="problem__content">
        <p class="problem__text">{{ text() }}</p>
        <ul class="problem__list">
          @for (bullet of bullets(); track bullet) {
            <li class="problem__item">{{ bullet }}</li>
          }
        </ul>
      </div>
    </section>
  `,
  styleUrl: './problem.component.scss',
})
export class ProblemComponent {
  text = input.required<string>();
  bullets = input.required<string[]>();
}
