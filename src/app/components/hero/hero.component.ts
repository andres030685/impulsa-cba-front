import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  template: `
    <section class="hero" aria-label="Presentación principal">
      <div class="hero__orb hero__orb--1"></div>
      <div class="hero__orb hero__orb--2"></div>
      <div class="hero__grid-bg"></div>

      <div class="hero__content">
        <p class="hero__badge">
          <span class="hero__badge-dot" aria-hidden="true"></span>
          Inteligencia artificial aplicada a tu negocio
        </p>
        <h1 class="hero__title">{{ title() }}</h1>
        <p class="hero__subtitle">{{ subtitle() }}</p>
        <button class="hero__cta" (click)="ctaClick.emit()">
          <span class="hero__cta-text">{{ ctaText() }}</span>
          <span class="hero__cta-arrow">&rarr;</span>
        </button>
      </div>
    </section>
  `,
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  title = input.required<string>();
  subtitle = input.required<string>();
  ctaText = input.required<string>();
  ctaClick = output<void>();
}
