import { Timestamp } from 'firebase/firestore';

export const STATUS = {
  active: 'active',
  inactive: 'inactive',
  deleted: 'deleted',
} as const;
export type Status = (typeof STATUS)[keyof typeof STATUS];

export interface ClassData {
  id?: string;
  title: string;
  description: string;
  image?: string;
  status?: Status;
}

export interface ClassSessionData extends Partial<ClassData> {
  classId: string;
  trainer: string;
  days: number[];
  startHour: string;
  endHour: string;
  dateStart: Timestamp;
  dateFinish: Timestamp;
  spots: number;
  events?: EventData[];
}

export interface EventData {
  id?: string;
  sessionId: string;
  date: Timestamp;
  spotsTaken: number;
  status: Status;
  users?: string[];
}

export interface SessionReservationData extends Partial<ClassSessionData> {
  userId: string;
  sessionId: string;
  eventId: string;
  date: Timestamp;
}
