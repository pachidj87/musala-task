import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateableComponent } from './createable.component';

describe('CreateableComponent', () => {
  let component: CreateableComponent;
  let fixture: ComponentFixture<CreateableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
