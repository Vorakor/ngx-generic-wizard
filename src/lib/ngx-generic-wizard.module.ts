import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import {
    NgxGenericWizardButtonContainerComponent,
} from './ngx-generic-wizard-button-container/ngx-generic-wizard-button-container.component';
import {
    NgxGenericWizardStepContainerComponent,
} from './ngx-generic-wizard-step-container/ngx-generic-wizard-step-container.component';
import { NgxGenericWizardWidgetComponent } from './ngx-generic-wizard-widget/ngx-generic-wizard-widget.component';
import { NgxGenericWizardService } from './ngx-generic-wizard.service';
import { NgxGwActionBtnComponent } from './ngx-gw-action-btn/ngx-gw-action-btn.component';
import { NgxGwEventStreamService } from './ngx-gw-event-stream.service';
import { NgxGwLineComponent } from './ngx-gw-line/ngx-gw-line.component';
import { NgxGwStepComponent } from './ngx-gw-step/ngx-gw-step.component';

@NgModule({
    declarations: [
        NgxGenericWizardButtonContainerComponent,
        NgxGenericWizardStepContainerComponent,
        NgxGenericWizardWidgetComponent,
        NgxGwActionBtnComponent,
        NgxGwLineComponent,
        NgxGwStepComponent,
    ],
    imports: [CommonModule, RouterModule.forChild([])],
    providers: [NgxGenericWizardService, NgxGwEventStreamService],
    exports: [
        NgxGenericWizardButtonContainerComponent,
        NgxGenericWizardStepContainerComponent,
        NgxGenericWizardWidgetComponent,
    ],
})
export class NgxGenericWizardModule {}
