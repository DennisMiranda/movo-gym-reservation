import { Component, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ClassSessionData } from '../../admin/classes/class.model';
import { ClassSessionsService } from '../../services/class-sessions/class-sessions';
import { WeekDaysPipe } from '../../utils/pipes/week-days/week-days-pipe';
import { ClassSessionEvents } from '../class-session-events/class-session-events';

@Component({
  selector: 'app-class-session-card',
  imports: [MatIconModule, WeekDaysPipe, MatButtonModule, ClassSessionEvents],
  templateUrl: './class-session-card.html',
  styleUrl: './class-session-card.scss',
})
export class ClassSessionCard {
  data = input.required<ClassSessionData>();
  private sessionsService = inject(ClassSessionsService);
  expandedClassId = signal<string | null>(null);

  showDescription = signal(false);

  toggleDescription() {
    this.showDescription.update((current) => !current);
  }

  reserveSpot(className: string, day: string, time: string) {
    alert(`Reserved ${className} for ${day} at ${time}`);
  }

  toggleClass(id: string) {
    const isExpanding = this.expandedClassId() !== id;

    this.expandedClassId.update((current) => (current === id ? null : id));
  }
}
