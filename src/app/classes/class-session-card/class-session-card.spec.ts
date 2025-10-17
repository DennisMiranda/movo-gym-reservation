import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassSessionCard } from './class-session-card';

describe('ClassSessionCard', () => {
  let component: ClassSessionCard;
  let fixture: ComponentFixture<ClassSessionCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassSessionCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassSessionCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
