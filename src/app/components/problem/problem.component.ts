import { Component, input } from '@angular/core';

@Component({
  selector: 'app-problem',
  standalone: true,
  template: `
    <section class="problem" aria-labelledby="problem-title">
      <div class="problem__content">
        <h2 class="problem__title" id="problem-title">Tu negocio está funcionando, pero sentís que podría mejorar</h2>
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
