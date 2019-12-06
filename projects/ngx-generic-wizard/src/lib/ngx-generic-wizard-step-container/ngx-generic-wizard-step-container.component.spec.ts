import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxGenericWizardStepContainerComponent } from './ngx-generic-wizard-step-container.component';
import { NgxGwLineComponent } from '../ngx-gw-line/ngx-gw-line.component';
import { NgxGwStepComponent } from '../ngx-gw-step/ngx-gw-step.component';
import { CommonModule } from '@angular/common';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { INgxGwStep } from '../interfaces';
import { NgxGenericWizardService } from '../ngx-generic-wizard.service';

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
  addSubscription = (sub: Subscription) => {};
  navigateToStep = (event: any) => {};
}

describe('NgxGenericWizardStepContainerComponent', () => {
  let component: NgxGenericWizardStepContainerComponent;
  let ngxGwService: NgxGenericWizardService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NgxGenericWizardStepContainerComponent,
        NgxGwLineComponent,
        NgxGwStepComponent
      ],
      imports: [RouterTestingModule, { ngModule: CommonModule }],
      providers: [
        NgxGenericWizardStepContainerComponent,
        { provide: NgxGenericWizardService, useClass: MockNgxGwService }
      ]
    });
    component = TestBed.get(NgxGenericWizardStepContainerComponent);
    ngxGwService = TestBed.get(NgxGenericWizardService);
  }));

  // tslint:disable-next-line: quotemark
  it("shouldn't create NgxGwStepContainerComponent without config defined.", () => {
    expect(component.config).toBeUndefined();
    expect(component).toBeTruthy();
  });

  it('If config is defined, should create NgxGwStepContainerComponent without errors', () => {
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
    expect(component).toBeTruthy();
  });
});
