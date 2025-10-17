import { DatePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { take } from 'rxjs';
import { ClassSessionsService } from '../../../../services/class-sessions/class-sessions';
import { WeekDaysPipe } from '../../../../utils/pipes/week-days/week-days-pipe';
import { ClassSessionData } from '../../class.model';
import { ClassSessionDialog } from '../class-session-dialog/class-session-dialog';

@Component({
  selector: 'app-class-sessions-table',
  imports: [MatTableModule, MatButtonModule, MatIconModule, DatePipe, WeekDaysPipe],
  templateUrl: './class-sessions-table.html',
  styleUrl: './class-sessions-table.css',
})
export class ClassSessionsTable {
  data = input.required<ClassSessionData[]>();
  displayedColumns: string[] = ['trainer', 'days', 'time', 'dateRange', 'spots', 'actions'];

  private dialog = inject(MatDialog);
  private snackbar = inject(MatSnackBar);
  private classSessionService = inject(ClassSessionsService);

  openEditSessionDialog(sessionData: ClassSessionData): void {
    this.dialog.open(ClassSessionDialog, {
      data: sessionData,
    });
  }

  deleteSession(sessionData: ClassSessionData) {
    this.classSessionService
      .deleteClassSession(sessionData.id || '')
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.snackbar.open(`Deleted ${sessionData.title}`, 'Close', {
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
