import { Component } from '@angular/core';
import { NgxGenericWizardService } from '../../public-api';

@Component({
  selector: 'ngx-gw-step-container',
  templateUrl: './ngx-generic-wizard-step-container.component.html',
  styleUrls: ['./ngx-generic-wizard-step-container.component.scss']
})
export class NgxGenericWizardStepContainerComponent {
  constructor(private ngxGwService: NgxGenericWizardService) {}

  navigate(event) {
    this.ngxGwService.navigateToStep(event);
  }
}
