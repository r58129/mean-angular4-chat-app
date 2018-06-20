import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OprequestComponent } from './oprequest.component';

describe('OprequestComponent', () => {
  let component: OprequestComponent;
  let fixture: ComponentFixture<OprequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OprequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OprequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
