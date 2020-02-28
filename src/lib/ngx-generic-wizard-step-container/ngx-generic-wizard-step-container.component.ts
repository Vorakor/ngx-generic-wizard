import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { INgxGwStep, INgxGwConfig } from '../interfaces';
import { NgxGenericWizardService } from '../ngx-generic-wizard.service';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

@Component({
    selector: 'ngx-gw-step-container',
    templateUrl: './ngx-generic-wizard-step-container.component.html',
    styleUrls: ['./ngx-generic-wizard-step-container.component.scss'],
})
export class NgxGenericWizardStepContainerComponent implements OnInit, OnChanges {
    @Input() config: INgxGwConfig;
    finalize$: Observable<boolean> = this.ngxGwService.finalized$;
    steps$: Observable<INgxGwStep[]> = this.ngxGwService.ngxGwSteps$.pipe(
        filter(steps => steps !== null),
        distinctUntilChanged(),
    );
    minOrder = 0;
    configuration: INgxGwConfig = {} as INgxGwConfig;
    constructor(private ngxGwService: NgxGenericWizardService) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes.config) {
            this.configuration = changes.config.currentValue;
        }
    }

    ngOnInit() {
        const wzStepSub = this.ngxGwService.initialized$
            .pipe(
                distinctUntilChanged(),
                filter(init => init !== null),
            )
            .subscribe(init => {
                if (!init) {
                    throw new Error(
                        'Need to initialize the wizard generator before steps can be shown',
                    );
                } else {
                    this.minOrder = this.ngxGwService.getMinOrder(this.configuration.configId);
                }
            });
        this.ngxGwService.addSubscription(wzStepSub);
    }

    navigate(event) {
        this.ngxGwService.navigateToStep(event);
    }
}
