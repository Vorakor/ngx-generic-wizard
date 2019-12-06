import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
// tslint:disable-next-line: max-line-length
import { NgxGenericWizardButtonContainerComponent } from './ngx-generic-wizard-button-container/ngx-generic-wizard-button-container.component';
import { NgxGenericWizardStepContainerComponent } from './ngx-generic-wizard-step-container/ngx-generic-wizard-step-container.component';
import { NgxGenericWizardService } from './ngx-generic-wizard.service';
import { NgxGenericWizardWidgetComponent } from './ngx-generic-wizard-widget/ngx-generic-wizard-widget.component';
import { NgxGwActionBtnComponent } from './ngx-gw-action-btn/ngx-gw-action-btn.component';
import { NgxGwLineComponent } from './ngx-gw-line/ngx-gw-line.component';
import { NgxGwStepComponent } from './ngx-gw-step/ngx-gw-step.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    NgxGenericWizardButtonContainerComponent,
    NgxGenericWizardStepContainerComponent,
    NgxGenericWizardWidgetComponent,
    NgxGwActionBtnComponent,
    NgxGwLineComponent,
    NgxGwStepComponent
  ],
  imports: [CommonModule, RouterModule.forChild([])],
  exports: [
    NgxGenericWizardButtonContainerComponent,
    NgxGenericWizardStepContainerComponent,
    NgxGenericWizardWidgetComponent,
    RouterModule
  ],
  providers: [NgxGenericWizardService]
})
export class NgxGenericWizardModule {}
