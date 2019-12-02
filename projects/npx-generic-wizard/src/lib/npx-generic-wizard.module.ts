import { NgModule } from "@angular/core";
import { NpxGenericWizardComponent } from "./npx-generic-wizard.component";

// Build in such a way that it doesn't matter if it's Material or Bootstrap that someone chooses...

@NgModule({
  declarations: [NpxGenericWizardComponent],
  imports: [],
  exports: [NpxGenericWizardComponent]
})
export class NpxGenericWizardModule {}
