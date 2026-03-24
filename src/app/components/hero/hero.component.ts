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
          <svg class="hero__badge-sparkle" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill="url(#sparkle-grad)"/>
            <path d="M19 15L19.75 17.25L22 18L19.75 18.75L19 21L18.25 18.75L16 18L18.25 17.25L19 15Z" fill="url(#sparkle-grad)" opacity="0.7"/>
            <defs>
              <linearGradient id="sparkle-grad" x1="4" y1="2" x2="22" y2="21">
                <stop stop-color="#00d2ff"/>
                <stop offset="1" stop-color="#a855f7"/>
              </linearGradient>
            </defs>
          </svg>
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
