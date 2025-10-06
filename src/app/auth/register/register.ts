import { Component, signal } from '@angular/core';
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
  email = signal('');
  password = signal('');
  name = signal('');
  errorMessage = signal('');
  loading = signal(false);
  subscriptions: Subscription = new Subscription();

  constructor(private authService: AuthService, private router: Router) {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        if (user.role === 'admin') {
          this.router.navigate(['/admin']);
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

    const subscription = this.authService
      .signup(this.email(), this.password(), this.name())
      .subscribe({
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
}
