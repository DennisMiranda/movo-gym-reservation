import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassSessionDialog } from './class-session-dialog';

describe('ClassSessionDialog', () => {
  let component: ClassSessionDialog;
  let fixture: ComponentFixture<ClassSessionDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassSessionDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassSessionDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
