import { TestBed } from '@angular/core/testing';

import { NpxGenericWizardService } from './npx-generic-wizard.service';

describe('NpxGenericWizardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NpxGenericWizardService = TestBed.get(NpxGenericWizardService);
    expect(service).toBeTruthy();
  });
});
