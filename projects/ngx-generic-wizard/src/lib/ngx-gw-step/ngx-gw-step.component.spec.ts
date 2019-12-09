import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxGwStepComponent } from './ngx-gw-step.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('NgxGwStepComponent', () => {
  let component: NgxGwStepComponent;
  let fixture: ComponentFixture<NgxGwStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NgxGwStepComponent],
      imports: [RouterTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxGwStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
