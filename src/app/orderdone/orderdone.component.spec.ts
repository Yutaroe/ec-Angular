import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderdoneComponent } from './orderdone.component';

describe('OrderdoneComponent', () => {
  let component: OrderdoneComponent;
  let fixture: ComponentFixture<OrderdoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderdoneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderdoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
