import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxGenericWizardButtonContainerComponent } from './ngx-generic-wizard-button-container.component';

describe('NgxGenericWizardButtonContainerComponent', () => {
  let component: NgxGenericWizardButtonContainerComponent;
  let fixture: ComponentFixture<NgxGenericWizardButtonContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxGenericWizardButtonContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxGenericWizardButtonContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
