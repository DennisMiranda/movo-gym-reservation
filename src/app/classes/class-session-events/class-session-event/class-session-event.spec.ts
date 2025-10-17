import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassSessionEvent } from './class-session-event';

describe('ClassSessionEvent', () => {
  let component: ClassSessionEvent;
  let fixture: ComponentFixture<ClassSessionEvent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassSessionEvent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassSessionEvent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
