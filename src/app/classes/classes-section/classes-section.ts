import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { map, switchMap } from 'rxjs';
import { ClassData, ClassSessionData } from '../../admin/classes/class.model';
import { ClassSessionsService } from '../../services/class-sessions/class-sessions';
import { ClassesService } from '../../services/classes/classes';
import { ClassSessionCard } from '../class-session-card/class-session-card';

@Component({
  selector: 'app-classes-section',
  imports: [CommonModule, MatIconModule, ClassSessionCard],
  templateUrl: './classes-section.html',
  styleUrl: './classes-section.scss',
})
export class ClassesSection implements OnInit {
  private classesService = inject(ClassesService);
  private sessionsService = inject(ClassSessionsService);

  classes = signal<Map<string, ClassData>>(new Map());
  sessions = signal<ClassSessionData[]>([]);

  ngOnInit(): void {
    // get classes from firestore
    this.classesService
      .getClasses()
      .pipe(
        map((data) => {
          const map = new Map<string, ClassData>();
          data.forEach((classItem) => {
            map.set(classItem.id!, classItem);
          });
          this.classes.set(map);
          return map;
        }),
        switchMap((map) => {
          const from = new Date();
          const to = new Date();
          from.setDate(from.getDate() - from.getDay());
          to.setDate(from.getDate() + 6);
          return this.sessionsService.getClassSessionsByWeek(from, to);
        })
      )
      .subscribe({
        next: (data) => {
          const sessions = data
            .map((session) => {
              const classItem = this.classes().get(session.classId);
              return {
                ...session,
                title: classItem?.title,
                description: classItem?.description,
                image: classItem?.image,
                status: !classItem?.status ? 'deleted' : session.status,
                events: [],
              };
            })
            .filter((session) => session.status !== 'deleted');

          this.sessions.set(sessions);
        },
        error: (err) => console.error('Error loading sessions', err),
      });
  }
}
