/**
 * Explanation of fields
 * StatusId - The identifier of the step status for the wizard.
 * Code - The string identifier of the step status for the wizard.
 * Description - The long name of the step status for the wizard.
 */
export interface INgxGwStepStatus {
  statusId?: number;
  code?: string;
  description?: string;
  Compare?(a: INgxGwStepStatus, b: INgxGwStepStatus): boolean;
}

export class NgxGwStepStatus implements INgxGwStepStatus {
  Compare = (a: INgxGwStepStatus, b: INgxGwStepStatus) => {
    let same = true;
    if (a.statusId !== b.statusId) {
      same = false;
    }
    if (a.code !== b.code) {
      same = false;
    }
    if (a.description !== b.description) {
      same = false;
    }
    return same;
  };
}
