import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassSessionForm } from './class-session-form';

describe('ClassSessionForm', () => {
  let component: ClassSessionForm;
  let fixture: ComponentFixture<ClassSessionForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassSessionForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassSessionForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
