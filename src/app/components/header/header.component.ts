import { Component, output } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="header" role="banner">
      <nav class="header__inner" aria-label="Navegación principal">
        <a class="header__logo" href="/" aria-label="Impulsa Cba — Ir al inicio">
          <img src="logo.svg" alt="Impulsa Cba — Tecnología aplicada" class="header__logo-img" width="180" height="36" />
        </a>
        <button class="header__cta" (click)="ctaClick.emit()">
          Analizar mi negocio
        </button>
      </nav>
    </header>
  `,
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  ctaClick = output<void>();
}
