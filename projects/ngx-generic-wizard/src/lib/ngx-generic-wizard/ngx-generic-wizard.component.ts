import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgxGenericWizardService } from '../ngx-generic-wizard.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-gw-container',
  templateUrl: './ngx-generic-wizard.component.html',
  styleUrls: ['./ngx-generic-wizard.component.scss']
})
export class NgxGenericWizardComponent implements OnDestroy {
  constructor(private ngxGwService: NgxGenericWizardService) {}

  navigate(event) {
    // this.ngxGwService.navigateToStep(event);
  }

  ngOnDestroy() {
    this.ngxGwService.destroyWizard();
  }
}
