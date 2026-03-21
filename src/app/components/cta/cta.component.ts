import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-cta',
  standalone: true,
  template: `
    <section class="cta">
      <button class="cta__button" (click)="ctaClick.emit()">
        {{ text() }}
      </button>
    </section>
  `,
  styleUrl: './cta.component.scss',
})
export class CtaComponent {
  text = input.required<string>();
  ctaClick = output<void>();
}
