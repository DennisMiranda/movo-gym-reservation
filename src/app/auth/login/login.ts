import { Component, OnDestroy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnDestroy {
  email = signal('');
  password = signal('');
  errorMessage = signal('');
  loading = signal(false);
  googleLoading = signal(false);
  subscriptions: Subscription = new Subscription();

  constructor(private authService: AuthService, private router: Router) {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        if (user.role === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/']);
        }
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  async onSubmit($event: Event) {
    $event.preventDefault();
    this.errorMessage.set('');
    this.loading.set(true);

    const subscription = this.authService.login(this.email(), this.password()).subscribe({
      next: () => {
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Something went wrong. Please try again.');
        this.loading.set(false);
      },
    });

    this.subscriptions.add(subscription);
  }

  async onGoogleSignIn() {
    this.errorMessage.set('');
    this.googleLoading.set(true);

    // try {
    //   const response = await this.authService.signInWithGoogle();
    //   await this.handleSignInResponse(response);
    // } catch (err) {
    //   this.errorMessage.set('Something went wrong. Please try again.');
    // } finally {
    //   this.googleLoading.set(false);
    // }
  }
}
