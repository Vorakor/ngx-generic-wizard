import {
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ChangeDetectorRef,
} from '@angular/core';
import { combineLatest, Observable, Subscription, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, filter, shareReplay } from 'rxjs/operators';

import { NgxGenericWizardService } from '../ngx-generic-wizard.service';
import { NgxGwEventStreamService } from '../ngx-gw-event-stream.service';

@Component({
    selector: 'ngx-gw-button-container',
    templateUrl: './ngx-generic-wizard-button-container.component.html',
    styleUrls: ['./ngx-generic-wizard-button-container.component.scss'],
})
export class NgxGenericWizardButtonContainerComponent implements OnInit, OnChanges, OnDestroy {
    @Input() resetWizardBtn = false;
    finalize$: Observable<boolean> = this.ngxGwService.finalized$.pipe(
        distinctUntilChanged(),
        shareReplay({ refCount: true, bufferSize: 1 }),
    );
    nextBtnText: string; // Turn into input
    prevBtnText: string; // Turn into input
    // prevBtnShow - internal variable used to determine when to show previous button
    prevBtnShow: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    prevBtnShow$: Observable<boolean> = this.prevBtnShow.asObservable();
    reenterBtnText: string; // Turn into input
    minButtonWidth: number; // Internal variable used to size buttons, no need to be input
    resetBtn: boolean;
    resetBtnText: string;
    subs: Subscription[] = [];
    constructor(
        private ngxGwService: NgxGenericWizardService,
        private ngxGwEventStream: NgxGwEventStreamService,
        private cref: ChangeDetectorRef,
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes.resetWizardBtn) {
            this.resetBtn = changes.resetWizardBtn.currentValue;
        }
    }

    ngOnInit() {
        this.prevBtnText = 'Previous';
        this.reenterBtnText = 'Re-enter Wizard';
        this.resetBtnText = 'Reset Wizard';
        const wzBtnSub = combineLatest(
            this.ngxGwService.ngxGwSteps$.pipe(
                filter(steps => steps.length > 0),
                distinctUntilChanged(),
                shareReplay({ refCount: true, bufferSize: 1 }),
            ),
            this.ngxGwService.ngxGwStepStatusMap$.pipe(
                filter(statusMap => statusMap !== null),
                distinctUntilChanged(),
                shareReplay({ refCount: true, bufferSize: 1 }),
            ),
        ).subscribe(([steps, statusMap]) => {
            const currentStep = steps.filter(
                step => step.status.code === statusMap.current.code,
            )[0];
            const maxOrder: number = Math.max.apply(
                Math,
                steps.map(step => step.stepOrder),
            );
            const minOrder: number = Math.min.apply(
                Math,
                steps.map(step => step.stepOrder),
            );
            if (currentStep && currentStep.stepOrder === maxOrder) {
                this.nextBtnText = 'Finish';
            } else {
                this.nextBtnText = 'Next';
            }
            if (currentStep && currentStep.stepOrder === minOrder) {
                this.prevBtnShow.next(false);
                // tslint:disable-next-line: no-string-literal
                if (!this.cref['destroyed']) {
                    this.cref.detectChanges();
                }
            } else {
                this.prevBtnShow.next(true);
                // tslint:disable-next-line: no-string-literal
                if (!this.cref['destroyed']) {
                    this.cref.detectChanges();
                }
            }
        });
        this.subs.push(wzBtnSub);
        this.setButtonSize();
    }

    action(event) {
        if (event === 'next') {
            this.next();
        } else if (event === 'previous') {
            this.previous();
        } else if (event === 'reenter') {
            this.reenter();
        } else {
            this.resetWizard();
        }
    }

    next() {
        this.ngxGwEventStream.submitToStream(this.next, 'Fired');
        this.ngxGwService.next();
    }

    previous() {
        this.ngxGwEventStream.submitToStream(this.previous, 'Fired');
        this.ngxGwService.prev();
    }

    reenter() {
        this.ngxGwEventStream.submitToStream(this.reenter, 'Fired');
        this.ngxGwService.resetFinalized();
    }

    resetWizard() {
        this.ngxGwEventStream.submitToStream(this.resetWizard, 'Fired');
        this.ngxGwService.resetWizard();
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

    ngOnDestroy() {
        this.subs.forEach(subscription => subscription.unsubscribe());
    }
}
