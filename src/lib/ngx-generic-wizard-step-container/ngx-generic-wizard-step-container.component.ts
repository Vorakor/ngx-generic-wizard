import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, shareReplay } from 'rxjs/operators';

import { INgxGwStep } from '../interfaces';
import { NgxGenericWizardService } from '../ngx-generic-wizard.service';

@Component({
    selector: 'ngx-gw-step-container',
    templateUrl: './ngx-generic-wizard-step-container.component.html',
    styleUrls: ['./ngx-generic-wizard-step-container.component.scss'],
})
export class NgxGenericWizardStepContainerComponent implements OnInit, OnDestroy {
    finalize$: Observable<boolean> = this.ngxGwService.finalized$; // Just grab from the service
    steps$: Observable<INgxGwStep[]> = this.ngxGwService.ngxGwSteps$.pipe(
        filter(steps => steps !== null),
        distinctUntilChanged(),
    ); // Just grab from the service.
    minOrder = 0;
    initTime = null;
    subs: Subscription[] = [];
    constructor(private ngxGwService: NgxGenericWizardService) {}

    ngOnInit() {
        const wzStepSub = this.ngxGwService.ngxGwSteps$
            .pipe(
                distinctUntilChanged(),
                filter(steps => steps.length > 0),
                shareReplay({ refCount: true, bufferSize: 1 }),
            )
            .subscribe(steps => {
                this.minOrder = this.ngxGwService.getMinOrder(steps);
            });
        this.subs.push(wzStepSub);
        const wzInitSub = this.ngxGwService.initialized$
            .pipe(
                distinctUntilChanged(),
                filter(init => init !== null),
                shareReplay({ refCount: true, bufferSize: 1 }),
            )
            .subscribe(init => {
                clearTimeout(this.initTime);
                this.initTime = setTimeout(() => {
                    if (!init) {
                        throw new Error(
                            'Need to initialize the wizard generator before steps can be shown',
                        );
                    }
                }, 1000);
            });
        this.subs.push(wzInitSub);
    }

    navigate(event) {
        this.ngxGwService.navigateToStep(event);
    }

    ngOnDestroy() {
        this.subs.forEach(subscription => subscription.unsubscribe());
    }
}
