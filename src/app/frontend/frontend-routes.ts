import { Routes } from '@angular/router';

export const frontendRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login-component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register-component').then(m => m.RegisterComponent)
  },
  {
    path: 'verification',
    loadComponent: () => import('./validation/validation-component').then(m => m.ValidationComponent)
  },
  {
    path: 'verification/:code',
    loadComponent: () => import('./validation/validation-component').then(m => m.ValidationComponent)
  },
];
