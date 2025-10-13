import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '', redirectTo: '/auth/login', pathMatch: 'full'
  },
  {
    path: 'auth', loadComponent: () => import('./frontend/layout-frontend/layout-frontend-component').then(m => m.LayoutFrontendComponent),
    children: [
      {
        path: '', loadChildren: () => import('./frontend/frontend-routes').then(m => m.frontendRoutes)
      }
    ]
  },
  {
    path: '', loadComponent: () => import('./backend/layout-backend/layout-backend-component').then(m => m.LayoutBackendComponent),
    children: [
      {
        path: '', loadChildren: () => import('./backend/backend-routes').then(m => m.backendRoutes),
        data: { preload: true, preloadDelay: 10 }
      }
    ],
  },
];
