import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxGwLineComponent } from './ngx-gw-line.component';

describe('NgxGwLineComponent', () => {
  let component: NgxGwLineComponent;
  let fixture: ComponentFixture<NgxGwLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxGwLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxGwLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
