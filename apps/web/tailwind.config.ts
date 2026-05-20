import type { Config } from "tailwindcss";
import {
  palette,
  AREA_THEMES,
  fontFamily,
  fontSize,
  lineHeight,
  fontWeight,
  letterSpacing,
  borderRadius,
  spacing
} from "@renace/tokens";

const areaColors = Object.fromEntries(
  Object.values(AREA_THEMES).map((area) => [
    area.id,
    {
      DEFAULT: area.core,
      tint: area.tint,
      border: area.border,
      text: area.text,
      on: area.onCore
    }
  ])
);

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "../../packages/**/src/**/*.{ts,tsx}"
  ],
  theme: {
    fontFamily: {
      sans: [...fontFamily.sans]
    },
    fontSize: {
      ...fontSize
    },
    lineHeight: {
      tight: String(lineHeight.tight),
      snug: String(lineHeight.snug),
      normal: String(lineHeight.normal),
      relaxed: String(lineHeight.relaxed)
    },
    fontWeight: {
      regular: fontWeight.regular,
      medium: fontWeight.medium,
      semibold: fontWeight.semibold,
      bold: fontWeight.bold
    },
    letterSpacing,
    borderRadius,
    extend: {
      spacing,
      colors: {
        canvas: palette.background.canvas,
        surface: palette.background.surface,
        elevated: palette.background.elevated,
        ink: {
          primary: palette.text.primary,
          secondary: palette.text.secondary,
          muted: palette.text.muted,
          subtle: palette.text.subtle,
          disabled: palette.text.disabled,
          inverse: palette.text.onColor
        },
        outline: {
          soft: palette.border.soft,
          medium: palette.border.medium,
          strong: palette.border.strong
        },
        brand: palette.brand,
        state: palette.state,
        area: areaColors
      },
      minHeight: {
        tap: spacing.tap
      },
      minWidth: {
        tap: spacing.tap
      }
    }
  },
  plugins: []
};

export default config;
