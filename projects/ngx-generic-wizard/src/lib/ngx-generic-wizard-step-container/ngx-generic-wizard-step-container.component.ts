import { Component } from '@angular/core';
import { NgxGenericWizardService } from '../ngx-generic-wizard.service';

@Component({
  selector: 'ngx-gw-container',
  templateUrl: './ngx-generic-wizard-step-container.component.html',
  styleUrls: ['./ngx-generic-wizard-step-container.component.scss']
})
export class NgxGenericWizardStepContainerComponent {
  constructor(private ngxGwService: NgxGenericWizardService) {}

  navigate(event) {
    // this.ngxGwService.navigateToStep(event);
  }
}
