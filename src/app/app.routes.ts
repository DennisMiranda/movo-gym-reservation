import { Routes } from '@angular/router';
import { adminGuard } from './admin/admin-guard/admin-guard-guard';
import { AdminLayout } from './admin/admin-layout/admin-layout';
import { authGuard } from './auth/auth-guard/auth-guard';
import { AuthLayout } from './auth/auth-layout/auth-layout';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { ClassesSection } from './classes/classes-section/classes-section';
import { MainLayout } from './main-layout/main-layout';
import { LandingPage } from './pages/landing-page/landing-page';
import { ReservationsPage } from './pages/reservations-page/reservations-page';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', component: LandingPage },
      {
        path: 'classes',
        component: ClassesSection,
      },
      {
        path: 'reservations',
        canActivate: [authGuard],
        component: ReservationsPage,
      },
    ],
  },
  {
    path: '',
    component: AuthLayout,
    children: [
      { path: 'login', component: Login },
      { path: 'register', component: Register },
    ],
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    component: AdminLayout,
    children: [
      { path: '', redirectTo: 'classes', pathMatch: 'full' },
      {
        path: 'classes',
        loadComponent: () => import('./admin/classes/classes').then((m) => m.Classes),
      },
      {
        path: 'classes/:id',
        loadComponent: () =>
          import('./admin/classes/class-detail/class-detail').then((m) => m.ClassDetail),
      },
      // {
      //   path: 'reservations',
      //   loadComponent: () =>
      //     import('./pages/reservations/reservations.component').then(
      //       (m) => m.ReservationsComponent
      //     ),
      // },
      // {
      //   path: 'users',
      //   loadComponent: () => import('./pages/users/users.component').then((m) => m.UsersComponent),
      // },
    ],
  },
];
