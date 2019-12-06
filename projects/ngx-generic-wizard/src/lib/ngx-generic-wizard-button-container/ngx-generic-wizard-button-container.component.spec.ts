import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxGenericWizardButtonContainerComponent } from './ngx-generic-wizard-button-container.component';
import { NgxGwActionBtnComponent } from '../ngx-gw-action-btn/ngx-gw-action-btn.component';
import { NgxGenericWizardService } from '../ngx-generic-wizard.service';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { INgxGwStep, INgxGwStepStatusMap, INgxGwConfig } from '../interfaces';
import { CommonModule } from '@angular/common';

class MockNgxGwService {
  ngxGwSteps$: Observable<INgxGwStep[]> = new BehaviorSubject<INgxGwStep[]>([
    {
      stepId: 0,
      configId: 0,
      status: {
        statusId: 0,
        code: 'CD',
        description: 'Code'
      },
      code: 'ST',
      description: 'step',
      stepOrder: 1,
      stepUrl: 'sample',
      ignoreIncomplete: false,
      icon: ''
    }
  ]).asObservable();
  initialized$: Observable<boolean> = new BehaviorSubject<boolean>(
    true
  ).asObservable();
  finalized$: Observable<boolean> = new BehaviorSubject<boolean>(
    false
  ).asObservable();
  wizardStepStatusMap$: Observable<INgxGwStepStatusMap[]> = new BehaviorSubject<
    INgxGwStepStatusMap[]
  >([]).asObservable();
  addSubscription = (sub: Subscription) => {};
  next = (config: INgxGwConfig) => {};
  prev = (config: INgxGwConfig) => {};
  resetFinalized = (config: INgxGwConfig) => {};
}

describe('NgxGenericWizardButtonContainerComponent', () => {
  let component: NgxGenericWizardButtonContainerComponent;
  let ngxGwService: NgxGenericWizardService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NgxGenericWizardButtonContainerComponent,
        NgxGwActionBtnComponent
      ],
      imports: [RouterTestingModule, { ngModule: CommonModule }],
      providers: [
        NgxGenericWizardButtonContainerComponent,
        { provide: NgxGenericWizardService, useClass: MockNgxGwService }
      ]
    });
    component = TestBed.get(NgxGenericWizardButtonContainerComponent);
    ngxGwService = TestBed.get(NgxGenericWizardService);
  }));

  // tslint:disable-next-line: quotemark
  it("shouldn't create NgxGwButtonContainerComponent without config defined.", () => {
    expect(component.config).toBeUndefined();
    expect(component).toBeTruthy();
  });

  it('If config is defined, should create NgxGwButtonContainerComponent without errors', () => {
    component.config = {
      configId: 0,
      code: 'CD',
      description: 'Code',
      baseUrl: 'post',
      finalizeUrl: 'sample',
      ignoreIncomplete: false,
      completedDisabled: false,
      applicationId: 0,
      moduleId: 0
    };
    expect(component.config).toBeDefined();
    expect(component).toBeTruthy();
  });
});
