import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BroadcastDetailComponent } from './broadcast-detail.component';

describe('BroadcastDetailComponent', () => {
  let component: BroadcastDetailComponent;
  let fixture: ComponentFixture<BroadcastDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BroadcastDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BroadcastDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
