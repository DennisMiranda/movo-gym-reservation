import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ClassesService } from '../../../services/classes/classes';
import { ClassData } from '../class.model';

@Component({
  selector: 'app-class-form',
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatOptionModule,
    MatButtonModule,
    MatIconModule,
    CdkTextareaAutosize,
  ],
  templateUrl: './class-form.html',
  styleUrl: './class-form.css',
})
export class ClassForm implements OnChanges {
  @Input() classData: ClassData | null = null;
  @Output() onSave = new EventEmitter<ClassData>();
  @Output() onClose = new EventEmitter<void>();

  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  private _injector = inject(Injector);
  readonly classesService = inject(ClassesService);

  // Signals
  title = signal('');
  description = signal('');
  image = signal('');

  ngOnChanges(changes: SimpleChanges) {
    if (changes['classData']) {
      if (this.classData) {
        this.title.set(this.classData.title);
        this.description.set(this.classData.description);
        this.image.set(this.classData.image || '');
      } else {
        this.resetForm();
      }
    }
  }

  triggerResize() {
    // Wait for content to render, then trigger textarea resize.
    afterNextRender(
      () => {
        this.autosize.resizeToFitContent(true);
      },
      {
        injector: this._injector,
      }
    );
  }

  resetForm() {
    this.title.set('');
    this.description.set('');
    this.image.set('');
  }

  handleSubmit(form: NgForm) {
    if (!form.valid) return;

    const classData = {
      title: this.title(),
      description: this.description(),
      image: this.image() || '',
    };

    const handleSuccess = () => {
      this.onSave.emit(classData);
      this.resetForm();
      this.handleClose();
    };

    const handleError = (error: unknown) => {
      console.error('Error saving class:', error);
    };

    if (this.classData?.id) {
      this.classesService.updateClass(this.classData.id, classData).subscribe({
        next: handleSuccess,
        error: handleError,
      });
    } else {
      this.classesService.addClass(classData).subscribe({
        next: handleSuccess,
        error: handleError,
      });
    }
  }

  handleClose() {
    this.resetForm();
    this.onClose.emit();
  }
}
