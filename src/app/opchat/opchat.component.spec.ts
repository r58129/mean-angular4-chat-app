import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpchatComponent } from './opchat.component';

describe('OpchatComponent', () => {
  let component: OpchatComponent;
  let fixture: ComponentFixture<OpchatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpchatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
