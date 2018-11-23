import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffPlanComponent } from './staff-plan.component';

describe('StaffPlanComponent', () => {
  let component: StaffPlanComponent;
  let fixture: ComponentFixture<StaffPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
