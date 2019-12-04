import { Component, OnInit, Input } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgxGenericWizardService } from '../../public-api';

@Component({
  selector: 'ngx-gw-next-btn',
  templateUrl: './ngx-gw-next-btn.component.html',
  styleUrls: ['./ngx-gw-next-btn.component.scss']
})
export class NgxGwNextBtnComponent implements OnInit {
  @Input() configId: number;
  btnText = 'Next';
  constructor(public wizardService: NgxGenericWizardService) {}

  ngOnInit() {
    if (!this.configId || this.configId === 0) {
      throw new Error('Previous button needs an assigned configuration!');
    }
    combineLatest(
      this.wizardService.ngxGwSteps$,
      this.wizardService.wizardStepStatusMap$
    )
      .pipe(
        map(([steps, statusMap]) => ({ Steps: steps, StatusMap: statusMap }))
      )
      .subscribe(results => {
        const currentStep = results.Steps.filter(
          step => step.status.code === results.StatusMap.current.code
        )[0];
        const maxOrder: number = Math.max.apply(
          Math,
          results.Steps.map(step => step.stepOrder)
        );
        if (currentStep && currentStep.stepOrder === maxOrder) {
          this.btnText = 'Finish';
        }
      });
  }
}
