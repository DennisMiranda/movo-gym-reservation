import { Component } from '@angular/core';
import { ClassesTable } from './classes-table/classes-table';

@Component({
  selector: 'app-classes',
  imports: [ClassesTable],
  templateUrl: './classes.html',
  styleUrl: './classes.css',
})
export class Classes {}
