/**
 * Explanation of fields
 * StepHistoryId - The identifier of the log row.
 * StepId - Which step changed.
 * ConfigId - What changed between the previous version and this version.
 * StatusId - What changed between the previous version and this version.
 * Code - What changed between the previous version and this version.
 * Description - What changed between the previous version and this version.
 * StepOrder - What changed between the previous version and this version.
 * StepUrl - What changed between the previous version and this version.
 * IgnoreIncomplete - What changed between the previous version and this version.
 * Icon - What changed between the previous version and this version.
 * EffectiveDate - When this change took place.
 * ActionTaken - The database method used (inserted, deleted, updated).
 */
export interface NgxGwStepHistory {
  stepHistoryId: number;
  stepId: number;
  configId: number;
  statusId: number;
  code: string;
  description: string;
  stepOrder: number;
  stepUrl: string;
  ignoreIncomplete: boolean;
  icon: string;
  effectiveDate: Date;
  actionTaken: string;
}
