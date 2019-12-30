import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxGwActionBtnComponent } from './ngx-gw-action-btn.component';

describe('NgxGwActionBtnComponent', () => {
  let component: NgxGwActionBtnComponent;
  let fixture: ComponentFixture<NgxGwActionBtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxGwActionBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxGwActionBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
