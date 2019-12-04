/**
 * Explanation of fields
 * ConfigId - The identifier of the configuration for the wizard, one configuration can have many steps,
 *            many history logs, etc.
 * Code - The shorthand string identifier for the configuration of the wizard.
 * Description - A long and more descriptive identifier for the wizard or just generic description of
 *               what the wizard does / how it operates.
 * BaseURL - The base url that the wizard will use when switching between steps of the process.
 *           I.E.: let's say your wizard is for a payment processing module within an application, now
 *           let's say there are three steps to this process that correspond to three different
 *           components within the payments module, let's say that the payments module has a url of
 *           /payments while the pages are at the corresponding urls of /payments/child1,
 *           /payments/child2, /payments/child3.  In this instance, the base URL is 'payments'.
 * FinalizeURL - The url where the wizard is to navigate to upon completion of the final step of the
 *               wizard.  This is set so that it can completely navigate out of the module if it needs to.
 * IgnoreIncomplete - Determines how the wizard operates: many users using one copy of the wizard
 *                    (false), vs many users each using their own copy of the wizard (true).
 * CompletedDisabled - Basically specifies that a user cannot simply jump back to completed steps to
 *                     adjust information, this option will add a 'previous' button to the UI.
 * ApplicationId - Link this to the application that is running the wizard, this will allow for one
 *                 application to run multiple wizards and is vital for how this wizard generator works.
 * ModuleId - Link this to the module that is running the wizard within the application, each
 *            application can have many modules and each module can have many wizards, also vital for
 *            how this wizard generator works.
 */
export interface INgxGwConfig {
  configId?: number;
  code?: string;
  description?: string;
  baseUrl?: string;
  finalizeUrl?: string;
  ignoreIncomplete?: boolean;
  completedDisabled?: boolean;
  applicationId?: number;
  moduleId?: number;
  Compare?(a: INgxGwConfig, b: INgxGwConfig): boolean;
}

export class NgxGwConfig implements INgxGwConfig {
  Compare = (a: INgxGwConfig, b: INgxGwConfig) => {
    let same = true;
    if (a.configId !== b.configId) {
      same = false;
    }
    if (a.code !== b.code) {
      same = false;
    }
    if (a.description !== b.description) {
      same = false;
    }
    if (a.baseUrl !== b.baseUrl) {
      same = false;
    }
    if (a.finalizeUrl !== b.finalizeUrl) {
      same = false;
    }
    if (a.ignoreIncomplete !== b.ignoreIncomplete) {
      same = false;
    }
    if (a.completedDisabled !== b.completedDisabled) {
      same = false;
    }
    if (a.applicationId !== b.applicationId) {
      same = false;
    }
    if (a.moduleId !== b.moduleId) {
      same = false;
    }
    return same;
  };
}
