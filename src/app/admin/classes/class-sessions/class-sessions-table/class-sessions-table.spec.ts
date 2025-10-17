import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassSessionsTable } from './class-sessions-table';

describe('ClassSessionsTable', () => {
  let component: ClassSessionsTable;
  let fixture: ComponentFixture<ClassSessionsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassSessionsTable],
    }).compileComponents();

    fixture = TestBed.createComponent(ClassSessionsTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
