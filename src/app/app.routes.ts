import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing/landing.component').then(m => m.LandingComponent),
    title: 'Impulsa Cba — Implementamos sistemas para vender más y trabajar mejor',
  },
  {
    path: 'confirmation',
    loadComponent: () =>
      import('./pages/confirmation/confirmation.component').then(m => m.ConfirmationComponent),
    title: 'Impulsa Cba — ¡Listo! Te esperamos en WhatsApp',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
