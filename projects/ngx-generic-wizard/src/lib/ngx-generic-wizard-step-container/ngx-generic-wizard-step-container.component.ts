import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { INgxGwStep, INgxGwConfig } from '../interfaces';
import { NgxGenericWizardService } from '../ngx-generic-wizard.service';

@Component({
  selector: 'ngx-gw-step-container',
  templateUrl: './ngx-generic-wizard-step-container.component.html',
  styleUrls: ['./ngx-generic-wizard-step-container.component.scss']
})
export class NgxGenericWizardStepContainerComponent implements OnInit {
  @Input() config: INgxGwConfig;
  steps$: Observable<INgxGwStep[]> = this.ngxGwService.ngxGwSteps$;
  constructor(private ngxGwService: NgxGenericWizardService) {}

  ngOnInit() {
    if (!this.config) {
      throw new Error('Wizard Step Container needs an assigned configuration');
    }
    const wzStepSub = this.ngxGwService.initialized$.subscribe(init => {
      if (!init) {
        throw new Error('Need to initialize the wizard generator!');
      }
    });
    this.ngxGwService.addSubscription(wzStepSub);
  }

  navigate(event) {
    this.ngxGwService.navigateToStep(event);
  }
}
