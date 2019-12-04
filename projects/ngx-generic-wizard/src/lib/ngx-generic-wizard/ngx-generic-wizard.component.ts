import { Component } from '@angular/core';
import { NgxGenericWizardService } from '../ngx-generic-wizard.service';

@Component({
  selector: 'ngx-gw-container',
  templateUrl: './ngx-generic-wizard.component.html',
  styleUrls: ['./ngx-generic-wizard.component.scss']
})
export class NgxGenericWizardComponent {
  constructor(private ngxGwService: NgxGenericWizardService) {}

  navigate(event) {
    // this.ngxGwService.navigateToStep(event);
  }
}
