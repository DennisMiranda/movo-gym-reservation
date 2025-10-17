import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { ClassSessionsService } from '../../../services/class-sessions/class-sessions';
import { ClassesService } from '../../../services/classes/classes';
import { ClassSessionDialog } from '../class-sessions/class-session-dialog/class-session-dialog';
import { ClassSessionsTable } from '../class-sessions/class-sessions-table/class-sessions-table';

@Component({
  selector: 'app-class-detail',
  imports: [ClassSessionsTable, AsyncPipe, MatButton, MatIconModule],
  templateUrl: './class-detail.html',
  styleUrl: './class-detail.scss',
})
export class ClassDetail {
  route = inject(ActivatedRoute);
  classesService = inject(ClassesService);
  classSessionsService = inject(ClassSessionsService);
  dialog = inject(MatDialog);
  // Get id from url
  classId = this.route.snapshot.paramMap.get('id') || '';

  classData$ = this.classesService.getClassById(this.classId);
  classSessions$ = this.classSessionsService.getClassSessionsByClassId(this.classId);

  openSessionForm() {
    this.dialog.open(ClassSessionDialog, {
      data: {
        classId: this.classId,
      },
    });
  }
}
