import { Routes } from '@angular/router';
import { MainLayout } from './main-layout/main-layout';
import { Hero } from './hero/hero';
import { AuthLayout } from './auth/auth-layout/auth-layout';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { AdminLayout } from './admin/admin-layout/admin-layout';
import { Dashboard } from './admin/dashboard/dashboard';
import { authGuard } from './auth/auth-guard/auth-guard';
import { adminGuard } from './admin/admin-guard/admin-guard-guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', component: Hero },
      {
        path: 'classes',
        component: Login,
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
      { path: '', component: Dashboard },
      {
        path: 'classes',
        loadComponent: () => import('./admin/classes/classes').then((m) => m.Classes),
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
