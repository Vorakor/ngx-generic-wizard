import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NgxGenericWizardService {
  subs: Subscription[] = [];
  constructor(private router: Router) {}

  initializeStepper() {
    /**
     * Pull payments facade stuff out of here and put them as basically
     * initialization parameters / functions you need to run before
     * initializing
     */
  }

  /**
   * Logic goals, if step order already exists in the list, then insert
   * duplicate step after original step with an order + 1, then shift all
   * of the other steps orders up one.
   *
   * Error checking goals, check each existing step for a duplicate to all
   * elements that are attempting to be inserted.
   */
  addSteps() {}

  removeSteps() {}

  setBaseUrl() {}

  next() {}

  navigateToStep() {}

  setStepStatuses() {}

  resetFinalized() {}

  destroyStepper() {
    this.subs.forEach(subscription => subscription.unsubscribe());
  }
}
