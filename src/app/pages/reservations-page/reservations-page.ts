import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SessionReservationData } from '../../admin/classes/class.model';
import { Reservation } from '../../reservations/reservation/reservation';
import { AuthService } from '../../services/auth/auth';
import { ClassSessionsService } from '../../services/class-sessions/class-sessions';
import { ClassesService } from '../../services/classes/classes';
import { ReservationsService } from '../../services/reservations/reservations';

@Component({
  selector: 'app-reservations-page',
  imports: [MatIconModule, AsyncPipe, Reservation, MatButtonModule, RouterLink],
  templateUrl: './reservations-page.html',
  styleUrl: './reservations-page.scss',
})
export class ReservationsPage {
  private authService = inject(AuthService);
  private classesService = inject(ClassesService);
  private classSessionsService = inject(ClassSessionsService);
  private reservationsService = inject(ReservationsService);
  private snackbar = inject(MatSnackBar);

  reservations$: Observable<SessionReservationData[]> | null = null;

  ngOnInit() {
    const userId = this.authService.user()?.uid;
    if (!userId) {
      return;
    }

    this.reservations$ = this.reservationsService.getUserReservations(userId).pipe(
      map((reservations) => {
        const now = new Date();
        return reservations
          .filter((reservation) => {
            const session = this.classSessionsService
              .sessions()
              .find((session) => session.id === reservation.sessionId);

            const classData = this.classesService
              .classes()
              .find((classData) => classData.id === reservation.classId);

            if (!session || !classData) {
              return false;
            }

            // Filter out past reservations
            const reservationDate = reservation.date.toDate();
            // Reset time part to compare only dates
            reservationDate.setHours(0, 0, 0, 0);
            const today = new Date(now);
            today.setHours(0, 0, 0, 0);
            return reservationDate >= today;
          })
          .sort((a, b) => {
            // Sort by date in ascending order (earliest first)
            return a.date.toDate().getTime() - b.date.toDate().getTime();
          });
      })
    );
  }
}
