import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatNativeDateModule,
  MatOptionModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ClassSessionsService } from '../../../../services/class-sessions/class-sessions';
import { DAYS, HOURS } from '../../../../utils/constants';
import { ClassSessionData } from '../../class.model';

@Component({
  selector: 'app-class-session-form',
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatOptionModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './class-session-form.html',
  styleUrl: './class-session-form.scss',
})
export class ClassSessionForm implements OnChanges {
  @Input() classSessionData: ClassSessionData | null = null;
  @Output() onSave = new EventEmitter<ClassSessionData>();
  @Output() onClose = new EventEmitter<void>();

  private _injector = inject(Injector);
  readonly classesService = inject(ClassSessionsService);

  // Signals
  classId = signal('');
  id = signal<string | null>(null);
  trainer = signal('');
  selectedDays = signal<number[]>([]);
  startHour = signal('');
  endHour = signal('');
  dateStart = signal<Date | null>(null);
  dateFinish = signal<Date | null>(null);
  spots = signal(1);

  //Consider the index of the array as the day of the week
  days = DAYS;

  availableHours = HOURS;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['classSessionData']) {
      if (this.classSessionData) {
        this.setValues(this.classSessionData);
      } else {
        this.setValues({} as ClassSessionData);
      }
    }
  }

  setValues(values: ClassSessionData) {
    this.classId.set(values.classId || '');
    this.id.set(values.id || null);
    this.trainer.set(values.trainer || '');
    this.selectedDays.set(values.days || []);
    this.startHour.set(values.startHour || '');
    this.endHour.set(values.endHour || '');
    this.dateStart.set(values.dateStart?.toDate() || null);
    this.dateFinish.set(values.dateFinish?.toDate() || null);
    this.spots.set(values.spots || 1);
  }

  handleSubmit(form: NgForm) {
    if (!form.valid) return;

    const classSessionData: ClassSessionData = {
      classId: this.classSessionData?.classId || '',
      trainer: this.trainer(),
      days: this.selectedDays(),
      startHour: this.startHour(),
      endHour: this.endHour(),
      dateStart: Timestamp.fromDate(this.dateStart()!),
      dateFinish: Timestamp.fromDate(this.dateFinish()!),
      spots: this.spots(),
    };

    const handleSuccess = () => {
      this.onSave.emit(classSessionData);
      this.setValues({} as ClassSessionData);
      this.handleClose();
    };

    const handleError = (error: unknown) => {
      console.error('Error saving class:', error);
    };

    if (this.classSessionData?.id) {
      this.classesService.updateClassSession(this.classSessionData.id, classSessionData).subscribe({
        next: handleSuccess,
        error: handleError,
      });
    } else {
      this.classesService.addClassSession(classSessionData).subscribe({
        next: handleSuccess,
        error: handleError,
      });
    }
  }

  handleClose() {
    this.setValues({} as ClassSessionData);
    this.onClose.emit();
  }

  onStartDateChange(date: Date | null) {
    if (!date) return;
    this.dateStart.set(date);

    const dateFinish = this.dateFinish();
    if (dateFinish && dateFinish < date) {
      this.dateFinish.set(null);
    }
  }

  onEndDateChange(date: Date | null) {
    if (!date) return;
    this.dateFinish.set(date);
  }
}
