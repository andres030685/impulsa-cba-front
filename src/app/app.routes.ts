import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing/landing.component').then(m => m.LandingComponent),
    title: 'Impulsa Cba — Te ayudamos a vender más y trabajar mejor con tecnología simple',
  },
  {
    path: 'diagnostico/:leadId',
    loadComponent: () =>
      import('./pages/diagnostico/diagnostico.component').then(m => m.DiagnosticoComponent),
    title: 'Impulsa Cba — Diagnóstico de tu negocio',
  },
  {
    path: 'resultado/:leadId',
    loadComponent: () =>
      import('./pages/resultado/resultado.component').then(m => m.ResultadoComponent),
    title: 'Impulsa Cba — Resultado del diagnóstico',
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
