import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClassForm } from '../class-form/class-form';

@Component({
  selector: 'app-class-form-dialog',
  imports: [ClassForm],
  templateUrl: './class-form-dialog.html',
  styleUrl: './class-form-dialog.scss',
})
export class ClassFormDialog {
  readonly data = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<ClassFormDialog>);

  onClose() {
    this.dialogRef.close();
  }
}
