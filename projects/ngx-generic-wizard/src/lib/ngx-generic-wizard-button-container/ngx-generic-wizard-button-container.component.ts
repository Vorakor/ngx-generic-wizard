import { Component, OnInit, Input } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { INgxGwConfig } from '../interfaces';
import { NgxGenericWizardService } from '../ngx-generic-wizard.service';

@Component({
  selector: 'ngx-gw-button-container',
  templateUrl: './ngx-generic-wizard-button-container.component.html',
  styleUrls: ['./ngx-generic-wizard-button-container.component.scss']
})
export class NgxGenericWizardButtonContainerComponent implements OnInit {
  @Input() config: INgxGwConfig;
  finalize$: Observable<boolean> = this.ngxGwService.finalized$;
  nextBtnText: string;
  prevBtnText: string;
  prevBtnShow: boolean;
  reenterBtnText: string;
  minButtonWidth: number;
  constructor(private ngxGwService: NgxGenericWizardService) {}

  ngOnInit() {
    if (!this.config) {
      throw new Error(
        'Wizard Button Container needs an assigned configuration'
      );
    }
    const wzStepSub = this.ngxGwService.initialized$.subscribe(init => {
      if (!init) {
        throw new Error('Need to initialize the wizard generator!');
      }
    });
    this.ngxGwService.addSubscription(wzStepSub);
    this.prevBtnText = 'Previous';
    this.reenterBtnText = 'Re-enter Wizard';
    const wzBtnSub = combineLatest(
      this.ngxGwService.ngxGwSteps$.pipe(
        map(steps =>
          steps.filter(step => step.configId === this.config.configId)
        ),
        distinctUntilChanged()
      ),
      this.ngxGwService.wizardStepStatusMap$.pipe(distinctUntilChanged())
    )
      .pipe(map(([st, statMap]) => ({ Steps: st, StatusMap: statMap })))
      .subscribe(results => {
        const currentStep = results.Steps.filter(
          step => step.status.code === results.StatusMap.current.code
        )[0];
        const maxOrder: number = Math.max.apply(
          Math,
          results.Steps.map(step => step.stepOrder)
        );
        const minOrder: number = Math.min.apply(
          Math,
          results.Steps.map(step => step.stepOrder)
        );
        if (currentStep && currentStep.stepOrder === maxOrder) {
          this.nextBtnText = 'Finish';
        } else {
          this.nextBtnText = 'Next';
        }
        if (currentStep && currentStep.stepOrder === minOrder) {
          this.prevBtnShow = false;
        } else {
          this.prevBtnShow = true;
        }
      });
    this.ngxGwService.addSubscription(wzBtnSub);
    this.setButtonSize();
  }

  action(event) {
    if (event === 'next') {
      this.next();
    } else if (event === 'previous') {
      this.previous();
    } else {
      this.reenter();
    }
  }

  next() {
    this.ngxGwService.next(this.config);
  }

  previous() {
    this.ngxGwService.prev(this.config);
  }

  reenter() {
    this.ngxGwService.resetFinalized(this.config);
  }

  setButtonSize() {
    let maxString = '';
    [this.nextBtnText, this.prevBtnText, this.reenterBtnText].forEach(text => {
      if (maxString.length === 0) {
        maxString = text;
      } else if (text.length > maxString.length) {
        maxString = text;
      }
    });
    const c = document.createElement('canvas');
    const context = c.getContext('2d');
    context.font = '16px Arial';
    this.minButtonWidth = Math.ceil(context.measureText(maxString).width);
  }
}
