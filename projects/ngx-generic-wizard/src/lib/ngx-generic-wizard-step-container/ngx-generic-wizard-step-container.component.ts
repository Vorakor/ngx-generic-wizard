import { Component, OnInit } from '@angular/core';
import { NgxGenericWizardService } from '../../public-api';
import { Observable } from 'rxjs';
import { INgxGwStep } from '../interfaces';

@Component({
  selector: 'ngx-gw-step-container',
  templateUrl: './ngx-generic-wizard-step-container.component.html',
  styleUrls: ['./ngx-generic-wizard-step-container.component.scss']
})
export class NgxGenericWizardStepContainerComponent implements OnInit {
  steps$: Observable<INgxGwStep[]> = this.ngxGwService.ngxGwSteps$;
  constructor(private ngxGwService: NgxGenericWizardService) {}

  ngOnInit() {
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
