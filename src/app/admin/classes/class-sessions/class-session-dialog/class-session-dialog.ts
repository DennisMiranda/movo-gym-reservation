import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClassSessionForm } from '../../class-sessions/class-session-form/class-session-form';

@Component({
  selector: 'app-class-session-dialog',
  imports: [ClassSessionForm],

  templateUrl: './class-session-dialog.html',
  styleUrl: './class-session-dialog.scss',
})
export class ClassSessionDialog {
  data = inject(MAT_DIALOG_DATA);

  private readonly dialogRef = inject(MatDialogRef<ClassSessionDialog>);

  handleClose() {
    this.dialogRef.close();
  }
}
