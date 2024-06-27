import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopcartdetailsComponent } from './shopcartdetails.component';

describe('ShopcartdetailsComponent', () => {
  let component: ShopcartdetailsComponent;
  let fixture: ComponentFixture<ShopcartdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopcartdetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopcartdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
