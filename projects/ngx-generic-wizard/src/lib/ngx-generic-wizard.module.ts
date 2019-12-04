import { NgModule } from '@angular/core';
import { NgxGenericWizardComponent } from './ngx-generic-wizard/ngx-generic-wizard.component';
import { NgxGwLineComponent } from './ngx-gw-line/ngx-gw-line.component';
import { NgxGwStepComponent } from './ngx-gw-step/ngx-gw-step.component';
import { NgxGwNextBtnComponent } from './ngx-gw-next-btn/ngx-gw-next-btn.component';
import { NgxGwPrevBtnComponent } from './ngx-gw-prev-btn/ngx-gw-prev-btn.component';
import { NgxGenericWizardService } from './ngx-generic-wizard.service';

@NgModule({
  declarations: [
    NgxGenericWizardComponent,
    NgxGwLineComponent,
    NgxGwStepComponent,
    NgxGwNextBtnComponent,
    NgxGwPrevBtnComponent
  ],
  imports: [],
  exports: [
    NgxGenericWizardComponent,
    NgxGwNextBtnComponent,
    NgxGwPrevBtnComponent
  ],
  providers: [NgxGenericWizardService]
})
export class NgxGenericWizardModule {}
