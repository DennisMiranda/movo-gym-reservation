import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  auth = inject(AuthService);
  router = inject(Router);

  menuOpen = signal(false);

  navItems = [
    { path: '/', icon: 'layout-dashboard', label: 'Dashboard' },
    { path: '/classes', icon: 'dumbbell', label: 'Classes' },
    { path: '/reservations', icon: 'calendar', label: 'Reservations' },
    { path: '/users', icon: 'users', label: 'Users' },
  ];

  mobileMenuOpen = signal(false);

  toggleMenu() {
    this.menuOpen.update((v) => !v);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update((v) => !v);
  }

  userMobileMenuOpen = signal(false);

  toggleUserMobileMenu() {
    this.userMobileMenuOpen.update((v) => !v);
  }

  closeMenu() {
    this.menuOpen.update((v) => !v);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
