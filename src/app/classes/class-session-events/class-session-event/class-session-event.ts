import { DatePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { take } from 'rxjs/operators';
import {
  ClassSessionData,
  EventData,
  SessionReservationData,
} from '../../../admin/classes/class.model';
import { AuthService } from '../../../services/auth/auth';
import { ReservationsService } from '../../../services/reservations/reservations';

@Component({
  selector: 'app-class-session-event',
  imports: [MatIconModule, DatePipe, MatButtonModule],
  templateUrl: './class-session-event.html',
  styleUrl: './class-session-event.scss',
})
export class ClassSessionEvent {
  data = input.required<EventData>();
  session = input.required<ClassSessionData>();

  auth = inject(AuthService);
  reservationsService = inject(ReservationsService);

  isReserved = computed(() => {
    return this.reservationsService.reservations().some((reservation) => {
      return reservation.eventId === this.data().id;
    });
  });

  // reserve event and put on firebase
  reserve() {
    // get user id from auth
    const userId = this.auth.user()?.uid;
    const eventId = this.data().id;
    const sessionId = this.data().sessionId;

    if (!userId) {
      this.auth.redirectToLogin();
      return;
    }

    if (this.session().spots - this.data().spotsTaken === 0) {
      return;
    }

    if (!eventId || !sessionId || !userId) {
      return;
    }

    const reservationData: SessionReservationData = {
      ...this.session(),
      eventId,
      sessionId,
      userId,
      date: this.data().date,
    };

    this.reservationsService
      .createReservation(reservationData)
      .pipe(take(1))
      .subscribe({
        next: () => {
          console.log('Reservation created');
        },
        error: (error) => {
          console.error('Error creating reservation:', error);
        },
      });
  }
}
