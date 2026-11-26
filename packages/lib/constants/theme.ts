import type { TCssVarsSchema } from '../types/css-vars';

/**
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 *
 * KEEP THIS FILE IN SYNC WITH `packages/ui/styles/theme.css`.
 *
 * These are the light-mode default values for the CSS custom properties
 * defined under `:root` in the theme stylesheet, exposed here as hex strings
 * so they can be used as defaults for colour-picker UI components and other
 * places that don't render through CSS variables.
 *
 * If you change a value in `theme.css`, update it here too. There is NO
 * automated check linking the two files; they have drifted historically
 * and will drift again unless you update both.
 *
 * Computed via `colord({ h, s, l }).toHex()` — see the inline HSL comments
 * for the source-of-truth values from `theme.css`.
 *
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 */
export const DEFAULT_BRAND_COLORS = {
  background: '#f8f9fc', //              225 40% 98%
  foreground: '#11152c', //              230 45% 12%
  muted: '#edeff8', //                   228 45% 95%
  mutedForeground: '#565d76', //         226 16% 40%
  popover: '#ffffff', //                 0 0% 100%
  popoverForeground: '#11152c', //       230 45% 12%
  card: '#f7f8fd', //                    228 60% 98%
  cardBorder: '#dde1ee', //              226 32% 90%
  cardForeground: '#11152c', //          230 45% 12%
  fieldCard: '#e3e8fc', //               228 80% 94%
  fieldCardBorder: '#4760e1', //         230 72% 58%
  fieldCardForeground: '#11152c', //     230 45% 12%
  widget: '#f1f2f9', //                  228 40% 96%
  widgetForeground: '#ebedf4', //        228 30% 94%
  border: '#dbdfeb', //                  226 28% 89%
  input: '#d3d7e4', //                   226 24% 86%
  primary: '#2c4add', //                 230 72% 52%
  primaryForeground: '#ffffff', //       0 0% 100%
  secondary: '#edeff7', //               228 40% 95%
  secondaryForeground: '#11152c', //     230 45% 12%
  accent: '#e7ebf8', //                  228 55% 94%
  accentForeground: '#11152c', //        230 45% 12%
  destructive: '#ff0000', //             0 100% 50%
  destructiveForeground: '#f8fafc', //   210 40% 98%
  ring: '#2c4add', //                    230 72% 52%
  warning: '#e1cb05', //                 54 96% 45%
  envelopeEditorBackground: '#f0f2fa', //226 50% 96%
  // `cardBorderTint` is intentionally excluded from the colour-picker UI:
  // unlike the rest of these tokens it is consumed via `rgb(var(--token))`
  // (not `hsl(...)`) and stored as raw RGB triplets in `theme.css`. It does
  // not flow through `toNativeCssVars` and is not user-customisable from the
  // branding form. `radius` is a length, not a colour, so it lives in
  // `DEFAULT_BRAND_RADIUS` below.
} as const satisfies Record<keyof Omit<TCssVarsSchema, 'radius' | 'cardBorderTint'>, string>;

export const DEFAULT_BRAND_RADIUS = '0.875rem';
