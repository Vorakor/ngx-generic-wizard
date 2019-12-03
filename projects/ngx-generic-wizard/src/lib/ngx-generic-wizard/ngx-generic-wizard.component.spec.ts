import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxGenericWizardComponent } from './ngx-generic-wizard.component';

describe('NgxGenericWizardComponent', () => {
  let component: NgxGenericWizardComponent;
  let fixture: ComponentFixture<NgxGenericWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NgxGenericWizardComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxGenericWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
