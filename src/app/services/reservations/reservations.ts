import { inject, Injectable, signal } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { collection, doc, increment, writeBatch } from 'firebase/firestore';
import { from, Observable } from 'rxjs';
import { SessionReservationData } from '../../admin/classes/class.model';

@Injectable({
  providedIn: 'root',
})
export class ReservationsService {
  private firestore = inject(Firestore);
  private COLLECTION_NAME = 'reservations';

  reservations = signal<SessionReservationData[]>(this.loadReservations());

  getUserReservations(userId: string): Observable<SessionReservationData[]> {
    const userDoc = doc(this.firestore, `users/${userId}`);
    const reservationsCol = collection(userDoc, this.COLLECTION_NAME);
    return collectionData(reservationsCol, { idField: 'id' }) as Observable<
      SessionReservationData[]
    >;
  }

  createReservation(reservationData: SessionReservationData) {
    const { eventId, sessionId, userId } = reservationData;
    const batch = writeBatch(this.firestore);
    const eventDoc = doc(this.firestore, `sessions/${sessionId}/events`, eventId);
    const eventUsers = collection(eventDoc, 'users');
    const userDoc = doc(this.firestore, 'users', userId);
    const userReservations = collection(userDoc, this.COLLECTION_NAME);
    batch.update(eventDoc, { spotsTaken: increment(1) });
    batch.set(doc(eventUsers, reservationData.userId), { id: reservationData.userId });
    batch.set(doc(userReservations), reservationData);
    return from(batch.commit());
  }

  cancelReservation(reservationData: SessionReservationData) {
    const { eventId, sessionId, userId } = reservationData;
    const batch = writeBatch(this.firestore);
    const eventDoc = doc(this.firestore, `sessions/${sessionId}/events`, eventId);
    const eventUsers = collection(eventDoc, 'users');
    const userDoc = doc(this.firestore, 'users', userId);
    const userReservations = collection(userDoc, this.COLLECTION_NAME);
    batch.update(eventDoc, { spotsTaken: increment(-1) });
    batch.delete(doc(eventUsers, reservationData.userId));
    batch.delete(doc(userReservations, reservationData.id));
    return from(batch.commit());
  }

  setReservations(reservations: SessionReservationData[]) {
    this.reservations.set(reservations);
    localStorage.setItem('reservations', JSON.stringify(reservations));
  }

  loadReservations() {
    const reservations = localStorage.getItem('reservations');
    return reservations ? JSON.parse(reservations) : [];
  }
}
