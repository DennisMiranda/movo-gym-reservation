import { Routes } from '@angular/router';
import { MainLayout } from './main-layout/main-layout';
import { Hero } from './hero/hero';
import { AuthLayout } from './auth/auth-layout/auth-layout';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';

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
];
