import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  auth = inject(AuthService);
  router = inject(Router);
  email = signal('');
  password = signal('');
  name = signal('');
  errorMessage = signal('');
  loading = signal(false);
  subscriptions: Subscription = new Subscription();

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  async onSubmit($event: Event) {
    $event.preventDefault();
    this.errorMessage.set('');
    this.loading.set(true);

    const subscription = this.auth.signup(this.email(), this.password(), this.name()).subscribe({
      next: (user) => {
        this.loading.set(false);
        if (user) {
          if (user.role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/']);
          }
        }
      },
      error: (err) => {
        this.errorMessage.set('Something went wrong. Please try again.');
        this.loading.set(false);
      },
    });

    this.subscriptions.add(subscription);
  }
}
