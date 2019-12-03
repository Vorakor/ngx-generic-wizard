/**
 * Explanation of fields
 * StatusId - The identifier of the step status for the wizard.
 * Code - The string identifier of the step status for the wizard.
 * Description - The long name of the step status for the wizard.
 */
export interface NgxGwStepStatus {
  statusId: number;
  code: string;
  description: string;
}

/**
 * These enum values correspond to the current statuses that should be in the status table.
 */
export enum NgxGwStepStatuses {
  INIT = "INITIATED",
  CUR = "CURRENT",
  COMP = "COMPLETE",
  INCOMP = "INCOMPLETE"
}
