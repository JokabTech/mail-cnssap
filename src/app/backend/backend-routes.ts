import { Routes } from '@angular/router';

export const backendRoutes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard-component').then(m => m.DashboardComponent),
    data: { preload: true, preloadDelay: 2000 }
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
    loadComponent: () => import('./incoming-mail/incoming-external-mail-list/incoming-external-mail-list-component').then(m => m.IncomingExternalMailListComponent),
    data: { preload: true, preloadDelay: 3000 }
  },
  {
    path: 'mails/incoming/external/form',
    loadComponent: () => import('./incoming-mail/incoming-external-mail-form/incoming-external-mail-form-component').then(m => m.IncomingExternalMailFormComponent),
    data: { preload: true, preloadDelay: 7000 }
  },
  {
    path: 'mails/incoming/external/detail',
    loadComponent: () => import('./incoming-mail/chunks/incoming-externa-mail-detail/incoming-externa-mail-detail-component').then(m => m.IncomingExternaMailDetailComponent),
    data: { preload: true, preloadDelay: 11000 }
  },
  {
    path: 'mails/incoming/external/detail/:id',
    loadComponent: () => import('./incoming-mail/chunks/incoming-externa-mail-detail/incoming-externa-mail-detail-component').then(m => m.IncomingExternaMailDetailComponent),
    data: { preload: true, preloadDelay: 11000 }
  },
  {
    path: 'mails/incoming/external/report',
    loadComponent: () => import('./report/incoming-external-mail-report/incoming-external-mail-report-component').then(m => m.IncomingExternalMailReportComponent),
    data: { preload: true, preloadDelay: 12000 }
  },
  {
    path: 'mails/incoming/external/analytics',
    loadComponent: () => import('./analytics/analytics-incoming-external-mail/analytics-incoming-external-mail-component').then(m => m.AnalyticsIncomingExternalMailComponent),
    data: { preload: true, preloadDelay: 13000 }
  },


  {
    path: 'mails/incoming/internal',
    loadComponent: () => import('./incoming-mail/incoming-internal-mail-list/incoming-internal-mail-list-component').then(m => m.IncomingInternalMailListComponent),
    data: { preload: true, preloadDelay: 4000 }
  },
  {
    path: 'mails/incoming/internal/form',
    loadComponent: () => import('./incoming-mail/incoming-internal-mail-form/incoming-internal-mail-form-component').then(m => m.IncomingInternalMailFormComponent),
    data: { preload: true, preloadDelay: 8000 }
  },
  {
    path: 'mails/incoming/internal/detail',
    loadComponent: () => import('./incoming-mail/chunks/incoming-interna-mail-detail/incoming-interna-mail-detail-component').then(m => m.IncomingInternaMailDetailComponent),
    data: { preload: true, preloadDelay: 10000 }
  },
  {
    path: 'mails/incoming/internal/report',
    loadComponent: () => import('./report/incoming-internal-mail-report/incoming-internal-mail-report-component').then(m => m.IncomingInternalMailReportComponent),
    data: { preload: true, preloadDelay: 10000 }
  },
  {
    path: 'mails/incoming/internal/analytics',
    loadComponent: () => import('./analytics/analytics-incoming-internal-mail/analytics-incoming-internal-mail-component').then(m => m.AnalyticsIncomingInternalMailComponent),
    data: { preload: true, preloadDelay: 10000 }
  },


  {
    path: 'mails/outgoing/external',
    loadComponent: () => import('./outgoing-mail/outgoing-external-mail-list/outgoing-external-mail-list-component').then(m => m.OutgoingExternalMailListComponent),
    data: { preload: true, preloadDelay: 5000 }
  },
  {
    path: 'mails/outgoing/external/form',
    loadComponent: () => import('./outgoing-mail/outgoing-external-mail-form/outgoing-external-mail-form-component').then(m => m.OutgoingExternalMailFormComponent),
    data: { preload: true, preloadDelay: 9000 }
  },
  {
    path: 'mails/outgoing/external/report',
    loadComponent: () => import('./report/outgoing-external-mail-report/outgoing-external-mail-report-component').then(m => m.OutgoingExternalMailReportComponent),
    data: { preload: true, preloadDelay: 7000 }
  },

  {
    path: 'mails/outgoing/internal',
    loadComponent: () => import('./outgoing-mail/outgoing-internal-mail-list/outgoing-internal-mail-list-component').then(m => m.OutgoingInternalMailListComponent),
    data: { preload: true, preloadDelay: 6000 }
  },
  {
    path: 'mails/outgoing/internal/form',
    loadComponent: () => import('./outgoing-mail/outgoing-internal-mail-form/outgoing-internal-mail-form-component').then(m => m.OutgoingInternalMailFormComponent),
    data: { preload: true, preloadDelay: 9000 }
  },
   {
    path: 'mails/outgoing/internal/report',
    loadComponent: () => import('./report/outgoing-internal-mail-report/outgoing-internal-mail-report-component').then(m => m.OutgoingInternalMailReportComponent),
    data: { preload: true, preloadDelay: 10000 }
  },

  {
    path: 'holidays',
    loadComponent: () => import('./holiday/holiday/holiday-component').then(m => m.HolidayComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./config/config/config-component').then(m => m.ConfigComponent)
  },

  {
    path: 'pdf',
    loadComponent: () => import('../shared/components/pdf-viewer/pdf-viewer-component').then(m => m.PdfViewerComponent)
  },
];
