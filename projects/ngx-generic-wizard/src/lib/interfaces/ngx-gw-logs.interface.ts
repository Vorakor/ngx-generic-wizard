/**
 * Explanation of fields
 * LogId - The identifier for this row.
 * UserId - Who accessed the wizard during this session.
 * StepId - Which step said user accessed.
 * StartTime - The timestamp when said user began the session with said step.
 * EndTime - The timestamp when said user ended the session with said step.
 * StatusId - The final status of the step upon the end of the session.
 */
export interface NgxGwLogs {
  logId: number;
  userId: number;
  stepId: number;
  startTime: Date;
  endTime: Date;
  statusId: number;
}
