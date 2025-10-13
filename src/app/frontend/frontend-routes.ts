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
  {
    path: 'forgot-password',
    loadComponent: () => import('./forgot-password/forgot-password-component').then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'reset-password/:token',
    loadComponent: () => import('./reset-password/reset-password-component').then(m => m.ResetPasswordComponent)
  },
];
