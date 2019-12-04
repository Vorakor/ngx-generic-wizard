import { Component, OnInit, Input } from '@angular/core';
import { INgxGwConfig, NgxGenericWizardService } from '../../public-api';

@Component({
  selector: 'ngx-gw-button-container',
  templateUrl: './ngx-generic-wizard-button-container.component.html',
  styleUrls: ['./ngx-generic-wizard-button-container.component.scss']
})
export class NgxGenericWizardButtonContainerComponent {
  @Input() config: INgxGwConfig;
  constructor(private ngxGwService: NgxGenericWizardService) {}
}
