import { AsyncPipe } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { ClassSessionData, EventData } from '../../admin/classes/class.model';
import { ClassSessionsService } from '../../services/class-sessions/class-sessions';
import { ClassSessionEvent } from './class-session-event/class-session-event';

@Component({
  selector: 'app-class-session-events',
  imports: [MatIconModule, AsyncPipe, MatButtonModule, ClassSessionEvent],
  templateUrl: './class-session-events.html',
  styleUrl: './class-session-events.scss',
})
export class ClassSessionEvents implements OnInit {
  session = input.required<ClassSessionData>();

  private sessionsService = inject(ClassSessionsService);

  events$: Observable<EventData[]> | null = null;

  ngOnInit() {
    const sessionId = this.session().id;
    // Load events only when expanding
    if (!this.events$ && sessionId) {
      this.events$ = this.sessionsService.getClassSessionEvents(sessionId);
    }
  }
}
