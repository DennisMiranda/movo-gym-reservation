import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

export interface ClassData {
  name: string;
  trainer: string;
  schedule: string;
  spots: number;
}

@Component({
  selector: 'app-class-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './class-form.html',
  styleUrl: './class-form.css',
})
export class ClassFormComponent implements OnChanges {
  @Input() classData: ClassData | null = null;
  @Output() onSave = new EventEmitter<ClassData>();
  @Output() onClose = new EventEmitter<void>();

  //Using signals
  name = signal('');
  trainer = signal('');
  schedule = signal('');
  spots = signal(1);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['classData']) {
      if (this.classData) {
        this.name.set(this.classData.name);
        this.trainer.set(this.classData.trainer);
        this.schedule.set(this.classData.schedule);
        this.spots.set(this.classData.spots);
      } else {
        this.resetForm();
      }
    }
  }

  resetForm() {
    this.name.set('');
    this.trainer.set('');
    this.schedule.set('');
    this.spots.set(1);
  }

  handleSubmit(form: NgForm) {
    if (form.valid) {
      this.onSave.emit({
        name: this.name(),
        trainer: this.trainer(),
        schedule: this.schedule(),
        spots: this.spots(),
      });
    }
  }

  handleClose() {
    this.onClose.emit();
  }
}
