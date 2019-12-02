import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NpxGenericWizardComponent } from './npx-generic-wizard.component';

describe('NpxGenericWizardComponent', () => {
  let component: NpxGenericWizardComponent;
  let fixture: ComponentFixture<NpxGenericWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NpxGenericWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NpxGenericWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
