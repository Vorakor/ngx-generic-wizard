import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxGenericWizardWidgetComponent } from './ngx-generic-wizard-widget.component';

describe('NgxGenericWizardWidgetComponent', () => {
  let component: NgxGenericWizardWidgetComponent;
  let fixture: ComponentFixture<NgxGenericWizardWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxGenericWizardWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxGenericWizardWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
