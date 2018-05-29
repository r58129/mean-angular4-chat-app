import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApploginComponent } from './applogin.component';
import { AuthserviceService } from '../../authservice.service';

describe('ApploginComponent', () => {
  let component: ApploginComponent;
  let fixture: ComponentFixture<ApploginComponent>;

    
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApploginComponent ],
      providers: [
        { provide: AuthserviceService, useValue: { isAuthenticated: () => false }}
      ]
    })
    .compileComponents();
  }));
    
//  beforeEach(async(() => {
//    TestBed.configureTestingModule({
//      declarations: [ ApploginComponent ]
//    })
//    .compileComponents();
//  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApploginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
