import { INgxGwColorSchemeStatuses } from './ngx-gw-color-scheme-statuses.interface';

export interface INgxGwColorSchemeStates {
  default: INgxGwColorSchemeStatuses;
  disabled: INgxGwColorSchemeStatuses;
  focus?: INgxGwColorSchemeStatuses;
  hover?: INgxGwColorSchemeStatuses;
  blur?: INgxGwColorSchemeStatuses;
}
