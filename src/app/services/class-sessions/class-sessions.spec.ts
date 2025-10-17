import { TestBed } from '@angular/core/testing';

import { ClassSessions } from './class-sessions';

describe('ClassSessions', () => {
  let service: ClassSessions;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassSessions);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
