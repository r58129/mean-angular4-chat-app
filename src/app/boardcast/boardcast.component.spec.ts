import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardcastComponent } from './boardcast.component';

describe('BoardcastComponent', () => {
  let component: BoardcastComponent;
  let fixture: ComponentFixture<BoardcastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardcastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardcastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
