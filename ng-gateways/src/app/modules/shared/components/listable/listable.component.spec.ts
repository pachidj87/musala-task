import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListableComponent } from './listable.component';

describe('ListableComponent', () => {
  let component: ListableComponent;
  let fixture: ComponentFixture<ListableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
