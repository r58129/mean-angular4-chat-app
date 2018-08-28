import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultichatComponent } from './multichat.component';

describe('MultichatComponent', () => {
  let component: MultichatComponent;
  let fixture: ComponentFixture<MultichatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultichatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultichatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
