import { inject, Injectable, signal } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import {
  collection,
  doc,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { from, map, Observable, of } from 'rxjs';
import { ClassSessionData, EventData, STATUS } from '../../admin/classes/class.model';

@Injectable({
  providedIn: 'root',
})
export class ClassSessionsService {
  COLLECTION_NAME = 'sessions';
  private firestore = inject(Firestore);

  sessions = signal<ClassSessionData[]>(this.loadClassSessions());

  /**
   * Generate events for a session given a start date, end date and an array of days
   * @param sessionId - Session ID
   * @param from - Start date
   * @param to - End date
   * @param days - Array of days (0 = Sunday, 1 = Monday, ...)
   * @returns Array of events
   */
  private generateEvents(sessionId: string, from: Date, to: Date, days: number[]): EventData[] {
    const events = [];
    const currentDate = from;
    while (currentDate <= to) {
      if (!days.includes(currentDate.getDay())) {
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }
      // End of the day
      const date = new Date(currentDate);
      date.setHours(23, 59, 59, 999);
      events.push({
        date: Timestamp.fromDate(date),
        spotsTaken: 0,
        users: [],
        sessionId: sessionId,
        status: STATUS.active,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return events;
  }

  getClassSessionsByClassId(classId: string): Observable<ClassSessionData[]> {
    if (!classId) return of([]);

    const queryRef = query(
      collection(this.firestore, this.COLLECTION_NAME),
      where('classId', '==', classId)
    );
    return collectionData(queryRef, { idField: 'id' }) as Observable<ClassSessionData[]>;
  }

  getClassSessionsByWeek(from: Date, to: Date): Observable<ClassSessionData[]> {
    // Firestore limitation: can only use one range filter per query
    // Query: dateStart <= weekEnd (to)
    const queryRef = query(
      collection(this.firestore, this.COLLECTION_NAME),
      where('dateStart', '<=', Timestamp.fromDate(to))
    );

    // Filter client-side: dateFinish >= weekStart (from)
    return (collectionData(queryRef, { idField: 'id' }) as Observable<ClassSessionData[]>).pipe(
      map((sessions) => sessions.filter((session) => session.dateFinish.toDate() >= from))
    );
  }

  getClassSessionEvents(sessionId: string): Observable<EventData[]> {
    const queryRef = query(
      collection(this.firestore, `${this.COLLECTION_NAME}/${sessionId}/events`),
      where('date', '>=', Timestamp.fromDate(new Date())),
      orderBy('date', 'asc')
    );
    return collectionData(queryRef, { idField: 'id' }) as Observable<EventData[]>;
  }

  addClassSession(classSessionData: ClassSessionData) {
    const batch = writeBatch(this.firestore);

    // Create session document with pre-generated ID
    const sessionCollection = collection(this.firestore, this.COLLECTION_NAME);
    const sessionDoc = doc(sessionCollection);
    const sessionId = sessionDoc.id;

    // Don't include events in the main document - it's a subcollection
    const { events, ...sessionDataWithoutEvents } = classSessionData;
    const sessionDataToSave = { ...sessionDataWithoutEvents, id: sessionId, status: STATUS.active };

    // Set the session document
    batch.set(sessionDoc, sessionDataToSave);

    // Create initial event in the events subcollection
    const eventsCollection = collection(sessionDoc, 'events');
    const eventsData = this.generateEvents(
      sessionId,
      new Date(classSessionData.dateStart.toDate()),
      new Date(classSessionData.dateFinish.toDate()),
      classSessionData.days
    );
    eventsData.forEach((event) => {
      batch.set(doc(eventsCollection), event);
    });

    // Commit the batch
    return from(batch.commit());
  }

  updateClassSession(id: string, classSessionData: Partial<ClassSessionData>) {
    return from(updateDoc(doc(this.firestore, this.COLLECTION_NAME, id), classSessionData));
  }

  deleteClassSession(id: string) {
    return from(
      updateDoc(doc(this.firestore, this.COLLECTION_NAME, id), { status: STATUS.deleted })
    );
  }

  setClassSessions(sessions: ClassSessionData[]) {
    this.sessions.set(sessions);
    localStorage.setItem('sessions', JSON.stringify(sessions));
  }

  loadClassSessions() {
    const sessions = localStorage.getItem('sessions');
    return sessions ? JSON.parse(sessions) : [];
  }
}
