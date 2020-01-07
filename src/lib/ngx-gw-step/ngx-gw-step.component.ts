import { Component, Input, Output, EventEmitter } from '@angular/core';
import { INgxGwStep, INgxGwStepStatusMap } from '../interfaces';
import { NgxGenericWizardService } from '../ngx-generic-wizard.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'ngx-gw-step',
    templateUrl: './ngx-gw-step.component.html',
    styleUrls: ['./ngx-gw-step.component.scss']
})
export class NgxGwStepComponent {
    @Input() step: INgxGwStep;
    @Output() navigate: EventEmitter<INgxGwStep> = new EventEmitter<INgxGwStep>(
        null
    );
    wizardStatusMap$: Observable<INgxGwStepStatusMap> = this.ngxGwService
        .wizardStepStatusMap$;
    constructor(private ngxGwService: NgxGenericWizardService) {}

    route() {
        this.navigate.emit(this.step);
    }

    getStepCount(stepOrder: number) {
        return this.ngxGwService.getStepCount(this.step.configId, stepOrder);
    }
}