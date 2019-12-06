import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxGenericWizardService } from './ngx-generic-wizard.service';

describe('NgxGenericWizardService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [RouterTestingModule]
    })
  );

  it('should be created', () => {
    const service: NgxGenericWizardService = TestBed.get(
      NgxGenericWizardService
    );
    expect(service).toBeTruthy();
  });

  it('should successfully run NgwGwService.initializeWizard()', () => {});

  it('should successfully run NgwGwService.addSteps()', () => {});

  it('should successfully run NgwGwService.removeSteps()', () => {});

  it('should successfully run NgwGwService.next()', () => {});

  it('should successfully run NgwGwService.prev()', () => {});

  it('should successfully run NgwGwService.navigateToStep()', () => {});

  it('should successfully run NgwGwService.setCurrentStepStatuses()', () => {});

  it('should successfully run NgwGwService.resetFinalized()', () => {});

  it('should successfully run NgwGwService.addSubscription()', () => {});

  it('should successfully run NgwGwService.setColorScheme()', () => {});

  it('should successfully run NgwGwService.setDefaultColorScheme()', () => {});

  it('should successfully run NgwGwService.destroyWizard()', () => {});
});
