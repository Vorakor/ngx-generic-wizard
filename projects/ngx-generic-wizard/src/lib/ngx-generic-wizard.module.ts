import { NgModule } from '@angular/core';
import { NgxGenericWizardComponent } from './ngx-generic-wizard/ngx-generic-wizard.component';

// Build in such a way that it doesn't matter if it's Material or Bootstrap that someone chooses...

@NgModule({
  declarations: [NgxGenericWizardComponent],
  imports: [],
  exports: [NgxGenericWizardComponent]
})
export class NgxGenericWizardModule {}
