import { DatePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs';
import { SessionReservationData } from '../../admin/classes/class.model';
import { ReservationsService } from '../../services/reservations/reservations';

@Component({
  selector: 'app-reservation',
  imports: [MatIconModule, DatePipe, MatButtonModule],
  templateUrl: './reservation.html',
  styleUrl: './reservation.scss',
})
export class Reservation {
  private snackbar = inject(MatSnackBar);
  private reservationsService = inject(ReservationsService);
  data = input.required<SessionReservationData>();

  cancelReservation() {
    this.reservationsService
      .cancelReservation(this.data())
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.snackbar.open(`Cancelled ${this.data().title}`, 'Close', {
            duration: 3000,
            panelClass: ['bg-red-600', 'text-white'],
          });
        },
        error: (error) => {
          console.error('Error canceling reservation:', error);
          this.snackbar.open(`Error canceling reservation: ${error.message}`, 'Close', {
            duration: 3000,
            panelClass: ['bg-red-600', 'text-white'],
          });
        },
      });
  }
}
