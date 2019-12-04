import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxGwPrevBtnComponent } from './ngx-gw-prev-btn.component';

describe('NgxGwPrevBtnComponent', () => {
  let component: NgxGwPrevBtnComponent;
  let fixture: ComponentFixture<NgxGwPrevBtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxGwPrevBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxGwPrevBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
