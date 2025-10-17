import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { ClassesService } from '../../../services/classes/classes';
import { ClassFormDialog } from '../class-form-dialog/class-form-dialog';
import { ClassData } from '../class.model';

@Component({
  selector: 'app-class-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatMenuModule, RouterLink],
  templateUrl: './class-card.html',
  styleUrl: './class-card.scss',
})
export class ClassCard {
  @Input() classData: ClassData | null = null;

  private snackbar = inject(MatSnackBar);
  private classesService = inject(ClassesService);
  private dialog = inject(MatDialog);

  openEditDialog(): void {
    this.dialog.open(ClassFormDialog, {
      data: this.classData,
    });
  }

  deleteClass() {
    this.classesService
      .deleteClass(this.classData?.id || '')
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.snackbar.open(`Deleted ${this.classData?.title}`, 'Close', {
            duration: 2000,
          });
        },
        error: (error) => {
          this.snackbar.open(error.message, 'Close', {
            duration: 2000,
          });
        },
      });
  }
}
