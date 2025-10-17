import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ClassesService } from '../../services/classes/classes';
import { ClassCard } from './class-card/class-card';
import { ClassFormDialog } from './class-form-dialog/class-form-dialog';

@Component({
  selector: 'app-classes',
  imports: [ClassCard, AsyncPipe, MatButton, MatIconModule],
  templateUrl: './classes.html',
  styleUrl: './classes.css',
})
export class Classes {
  readonly classesService = inject(ClassesService);
  readonly dialog = inject(MatDialog);

  classes$ = this.classesService.getClasses();

  openDialog(): void {
    this.dialog.open(ClassFormDialog);
  }
}
