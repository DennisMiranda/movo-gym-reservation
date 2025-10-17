import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassSessionEvents } from './class-session-events';

describe('ClassSessionEvents', () => {
  let component: ClassSessionEvents;
  let fixture: ComponentFixture<ClassSessionEvents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassSessionEvents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassSessionEvents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
