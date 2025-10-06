import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../services/auth/auth';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  providers: [AuthService],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  mobileMenuOpen = false;
  currentUser = signal<User | null>(null);

  constructor(private auth: AuthService, private router: Router) {
    this.auth.currentUser$.subscribe((user) => {
      console.log(user);
      this.currentUser.set(user);
    });
  }

  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  userMobileMenuOpen = false;

  toggleUserMobileMenu() {
    this.userMobileMenuOpen = !this.userMobileMenuOpen;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
