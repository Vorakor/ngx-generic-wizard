import { Component, EventEmitter, Input, Output } from '@angular/core';

import { INgxGwStep } from '../interfaces';
import { NgxGenericWizardService } from '../ngx-generic-wizard.service';
import { NgxGwEventStreamService } from '../ngx-gw-event-stream.service';

@Component({
    selector: 'ngx-gw-step',
    templateUrl: './ngx-gw-step.component.html',
    styleUrls: ['./ngx-gw-step.component.scss'],
})
export class NgxGwStepComponent {
    @Input() step: INgxGwStep;
    @Output() navigate: EventEmitter<INgxGwStep> = new EventEmitter<INgxGwStep>(null);
    statusMap$ = this.ngxGwService.ngxGwStepStatusMap$;
    constructor(
        private ngxGwService: NgxGenericWizardService,
        private ngxEventStream: NgxGwEventStreamService,
    ) {}

    route() {
        this.ngxEventStream.submitToStream(this.route, 'Fired', this.step);
        this.navigate.emit(this.step);
    }

    getStepCount(stepOrder: number) {
        return this.ngxGwService.getStepCount(stepOrder);
    }
}
