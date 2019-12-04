import { INgxGwStepStatus } from './ngx-gw-step-status.interface';

export interface NgxGwStepStatusMap {
  initial: INgxGwStepStatus;
  current: INgxGwStepStatus;
  complete: INgxGwStepStatus;
  incomplete: INgxGwStepStatus;
}
