import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxGenericWizardStepContainerComponent } from './ngx-generic-wizard-step-container.component';

describe('NgxGenericWizardComponent', () => {
  let component: NgxGenericWizardStepContainerComponent;
  let fixture: ComponentFixture<NgxGenericWizardStepContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NgxGenericWizardStepContainerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxGenericWizardStepContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
