import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxGwNextBtnComponent } from './ngx-gw-next-btn.component';

describe('NgxGwNextBtnComponent', () => {
  let component: NgxGwNextBtnComponent;
  let fixture: ComponentFixture<NgxGwNextBtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxGwNextBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxGwNextBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
