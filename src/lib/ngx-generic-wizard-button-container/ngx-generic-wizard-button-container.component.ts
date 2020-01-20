import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, distinctUntilChanged, filter } from 'rxjs/operators';
import { INgxGwConfig } from '../interfaces';
import { NgxGenericWizardService } from '../ngx-generic-wizard.service';

@Component({
    selector: 'ngx-gw-button-container',
    templateUrl: './ngx-generic-wizard-button-container.component.html',
    styleUrls: ['./ngx-generic-wizard-button-container.component.scss'],
})
export class NgxGenericWizardButtonContainerComponent implements OnInit, OnChanges {
    @Input() config: INgxGwConfig;
    finalize$: Observable<boolean> = this.ngxGwService.finalized$;
    nextBtnText: string;
    prevBtnText: string;
    prevBtnShow: boolean;
    reenterBtnText: string;
    minButtonWidth: number;
    configuration: INgxGwConfig = {} as INgxGwConfig;
    constructor(private ngxGwService: NgxGenericWizardService) {}

    ngOnInit() {
        if (!this.configuration) {
            throw new Error('Wizard Button Container needs an assigned configuration');
        }
        const wzStepSub = this.ngxGwService.initialized$
            .pipe(
                distinctUntilChanged(),
                filter(init => init !== null),
            )
            .subscribe(init => {
                if (!init) {
                    throw new Error('Need to initialize the wizard generator!');
                }
            });
        this.ngxGwService.addSubscription(wzStepSub);
        this.prevBtnText = 'Previous';
        this.reenterBtnText = 'Re-enter Wizard';
        const wzBtnSub = combineLatest(
            this.ngxGwService.ngxGwSteps$.pipe(
                filter(steps => steps !== null),
                map(steps => steps.filter(step => step.configId === this.configuration.configId)),
                distinctUntilChanged(),
            ),
            this.ngxGwService.wizardStepStatusMap$.pipe(distinctUntilChanged()),
        )
            .pipe(map(([st, statMap]) => ({ Steps: st, StatusMap: statMap })))
            .subscribe(results => {
                const currentStep = results.Steps.filter(
                    step => step.status.code === results.StatusMap.current.code,
                )[0];
                const maxOrder: number = Math.max.apply(
                    Math,
                    results.Steps.map(step => step.stepOrder),
                );
                const minOrder: number = Math.min.apply(
                    Math,
                    results.Steps.map(step => step.stepOrder),
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

    ngOnChanges(changes: SimpleChanges) {
        if (changes.config) {
            this.configuration = changes.config.currentValue;
        }
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
        this.ngxGwService.next(this.configuration);
    }

    previous() {
        this.ngxGwService.prev(this.configuration);
    }

    reenter() {
        this.ngxGwService.resetFinalized(this.configuration);
    }

    setButtonSize() {
        let maxString = '';
        [this.nextBtnText, this.prevBtnText, this.reenterBtnText].forEach(text => {
            if (maxString && maxString.length === 0) {
                maxString = text;
            } else if (text && text.length > maxString.length) {
                maxString = text;
            }
        });
        const c = document.createElement('canvas');
        const context = c.getContext('2d');
        context.font = '16px Arial';
        this.minButtonWidth = Math.ceil(context.measureText(maxString).width);
    }
}
