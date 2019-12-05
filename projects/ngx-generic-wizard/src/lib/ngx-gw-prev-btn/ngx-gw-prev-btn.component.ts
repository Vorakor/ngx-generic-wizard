import { Component, OnInit, Input } from '@angular/core';
import { NgxGenericWizardService } from '../../public-api';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ngx-gw-prev-btn',
  templateUrl: './ngx-gw-prev-btn.component.html',
  styleUrls: ['./ngx-gw-prev-btn.component.scss']
})
export class NgxGwPrevBtnComponent implements OnInit {
  @Input() configId: number;
  btnText = 'Previous';
  showBtn = true;
  constructor(public ngxGwService: NgxGenericWizardService) {}

  ngOnInit() {
    if (!this.configId || this.configId === 0) {
      throw new Error('Previous button needs an assigned configuration!');
    }
    combineLatest(
      this.ngxGwService.ngxGwSteps$.pipe(
        map(steps => steps.filter(step => step.configId === this.configId))
      ),
      this.ngxGwService.wizardStepStatusMap$
    )
      .pipe(
        map(([steps, statusMap]) => ({ Steps: steps, StatusMap: statusMap }))
      )
      .subscribe(results => {
        const currentStep = results.Steps.filter(
          step => step.status.code === results.StatusMap.current.code
        )[0];
        const minOrder: number = Math.min.apply(
          Math,
          results.Steps.map(step => step.stepOrder)
        );
        if (currentStep && currentStep.stepOrder === minOrder) {
          this.showBtn = false;
        }
      });
  }
}
