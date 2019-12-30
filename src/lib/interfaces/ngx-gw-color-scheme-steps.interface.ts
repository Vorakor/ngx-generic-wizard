import { INgxGwColorSchemeStates } from './ngx-gw-color-scheme-states.interface';

export interface INgxGwColorSchemeSteps {
  textColor: INgxGwColorSchemeStates;
  backgroundColor: INgxGwColorSchemeStates;
  badgeTextColor?: INgxGwColorSchemeStates;
  badgeBackgroundColor?: INgxGwColorSchemeStates;
  boxShadowColor?: INgxGwColorSchemeStates;
}
