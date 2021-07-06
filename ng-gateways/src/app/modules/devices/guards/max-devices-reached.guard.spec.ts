import { TestBed } from '@angular/core/testing';

import { MaxDevicesReachedGuard } from './max-devices-reached.guard';

describe('MaxDevicesReachedGuard', () => {
  let guard: MaxDevicesReachedGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MaxDevicesReachedGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
