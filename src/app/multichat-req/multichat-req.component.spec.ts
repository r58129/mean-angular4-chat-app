import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultichatReqComponent } from './multichat-req.component';

describe('MultichatReqComponent', () => {
  let component: MultichatReqComponent;
  let fixture: ComponentFixture<MultichatReqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultichatReqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultichatReqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
