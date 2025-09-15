import { Routes } from '@angular/router';

export const backendRoutes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard-component').then(m => m.DashboardComponent)
  },
  {
    path: 'users',
    loadComponent: () => import('./users/users-component').then(m => m.UsersComponent)
  },
  {
    path: 'user/roles',
    loadComponent: () => import('./roles-user/roles-user-component').then(m => m.RolesUserComponent)
  },
  {
    path: 'departments',
    loadComponent: () => import('./department/department/department-component').then(m => m.DepartmentComponent)
  },
  {
    path: 'functions',
    loadComponent: () => import('./function/function/function-component').then(m => m.FunctionComponent)
  },
  {
    path: 'documents',
    loadComponent: () => import('./documentType/document-type-component/document-type-component').then(m => m.DocumentTypeComponent)
  },
  {
    path: 'mails/incoming/external',
    loadComponent: () => import('./incoming-mail/incoming-external-mail-list/incoming-external-mail-list-component').then(m => m.IncomingExternalMailListComponent)
  },
  {
    path: 'mails/incoming/external/form',
    loadComponent: () => import('./incoming-mail/incoming-external-mail-form/incoming-external-mail-form-component').then(m => m.IncomingExternalMailFormComponent)
  },
  {
    path: 'mails/incoming/external/detail',
    loadComponent: () => import('./incoming-mail/chunks/incoming-externa-mail-detail/incoming-externa-mail-detail-component').then(m => m.IncomingExternaMailDetailComponent)
  },
  {
    path: 'mails/incoming/internal',
    loadComponent: () => import('./incoming-mail/incoming-internal-mail-list/incoming-internal-mail-list-component').then(m => m.IncomingInternalMailListComponent)
  },
  {
    path: 'mails/incoming/internal/form',
    loadComponent: () => import('./incoming-mail/incoming-internal-mail-form/incoming-internal-mail-form-component').then(m => m.IncomingInternalMailFormComponent)
  },
  {
    path: 'mails/incoming/internal/detail',
    loadComponent: () => import('./incoming-mail/chunks/incoming-interna-mail-detail/incoming-interna-mail-detail-component').then(m => m.IncomingInternaMailDetailComponent)
  },
];
