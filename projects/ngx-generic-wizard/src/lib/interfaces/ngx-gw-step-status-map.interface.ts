import { INgxGwStepStatus } from './ngx-gw-step-status.interface';

export interface INgxGwStepStatusMap {
  initial: INgxGwStepStatus;
  current: INgxGwStepStatus;
  complete: INgxGwStepStatus;
  incomplete: INgxGwStepStatus;
}
