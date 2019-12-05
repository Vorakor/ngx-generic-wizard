import { NgModule } from '@angular/core';
import { NgxGenericWizardStepContainerComponent } from './ngx-generic-wizard-step-container/ngx-generic-wizard-step-container.component';
import { NgxGwLineComponent } from './ngx-gw-line/ngx-gw-line.component';
import { NgxGwStepComponent } from './ngx-gw-step/ngx-gw-step.component';
import { NgxGwNextBtnComponent } from './ngx-gw-next-btn/ngx-gw-next-btn.component';
import { NgxGwPrevBtnComponent } from './ngx-gw-prev-btn/ngx-gw-prev-btn.component';
import { NgxGenericWizardService } from './ngx-generic-wizard.service';
import { CommonModule } from '@angular/common';
// tslint:disable-next-line: max-line-length
import { NgxGenericWizardButtonContainerComponent } from './ngx-generic-wizard-button-container/ngx-generic-wizard-button-container.component';
import { NgxGenericWizardWidgetComponent } from './ngx-generic-wizard-widget/ngx-generic-wizard-widget.component';

@NgModule({
  declarations: [
    NgxGenericWizardStepContainerComponent,
    NgxGwLineComponent,
    NgxGwStepComponent,
    NgxGwNextBtnComponent,
    NgxGwPrevBtnComponent,
    NgxGenericWizardButtonContainerComponent,
    NgxGenericWizardWidgetComponent
  ],
  imports: [CommonModule],
  exports: [
    NgxGenericWizardStepContainerComponent,
    NgxGenericWizardButtonContainerComponent,
    NgxGenericWizardWidgetComponent
  ],
  providers: [NgxGenericWizardService]
})
export class NgxGenericWizardModule {}
