import { TestBed } from "@angular/core/testing";

import { NgxGenericWizardService } from "./ngx-generic-wizard.service";

describe("NgxGenericWizardService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: NgxGenericWizardService = TestBed.get(
      NgxGenericWizardService
    );
    expect(service).toBeTruthy();
  });
});
