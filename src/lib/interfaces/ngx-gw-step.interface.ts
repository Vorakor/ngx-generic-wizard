import { INgxGwStepStatus } from './ngx-gw-step-status.interface';

/**
 * Explanation of fields
 * StepId - The identifier for this row.
 * ConfigId - Which configuration the step belongs to.
 * StatusId - The current status of the step.
 * Code - The short name of the step.
 * Description - The display name of the step.
 * StepOrder - The order the step needs to appear in, in multiples of 100 so
 *             that we can easily assign more steps in between other ones.
 * StepUrl - The component / page that this step corresponds to.
 * IgnoreIncomplete -
 * Icon - Basically if you want to have an icon display in the step box.
 */
export interface INgxGwStep {
    stepId?: number;
    configId?: number;
    status?: INgxGwStepStatus;
    code?: string;
    description?: string;
    stepOrder?: number;
    stepUrl?: string;
    ignoreIncomplete?: boolean;
    icon?: string;
}
