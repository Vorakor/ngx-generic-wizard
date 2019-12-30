import { INgxGwColorSchemeLines } from './ngx-gw-color-scheme-lines.interface';
import { INgxGwColorSchemeButtons } from './ngx-gw-color-scheme-buttons.interface';
import { INgxGwColorSchemeSteps } from './ngx-gw-color-scheme-steps.interface';

export interface INgxGwColorScheme {
  buttons: INgxGwColorSchemeButtons;
  steps: INgxGwColorSchemeSteps;
  lines: INgxGwColorSchemeLines;
  configId?: number;
}
