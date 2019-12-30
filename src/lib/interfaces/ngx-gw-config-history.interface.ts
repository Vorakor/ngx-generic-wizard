/**
 * Explanation of fields
 * ConfigHistoryId - The identifier of the log row.
 * ConfigId - Which configuration changed.
 * Code - What changed between the previous version and this version.
 * Description - What changed between the previous version and this version.
 * BaseURL - What changed between the previous version and this version.
 * FinalizeURL - What changed between the previous version and this version.
 * IgnoreIncomplete - What changed between the previous version and this version.
 * CompletedDisabled - What changed between the previous version and this version.
 * ApplicationId - What changed between the previous version and this version.
 * ModuleId - What changed between the previous version and this version.
 * EffectiveDate - When this change took place.
 * ActionTaken - The database method used (inserted, deleted, updated).
 */
export interface INgxGwConfigHistory {
  configHistoryId: number;
  configId: number;
  code: string;
  description: string;
  baseUrl: string;
  finalizeUrl: string;
  ignoreIncomplete: boolean;
  completedDisabled: boolean;
  applicationId: number;
  moduleId: number;
  effectiveDate: Date;
  actionTaken: string;
}
