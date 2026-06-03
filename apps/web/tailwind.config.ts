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
        accent: palette.accent,
        state: palette.state,
        area: areaColors
      },
      minHeight: {
        tap: spacing.tap
      },
      minWidth: {
        tap: spacing.tap
      },
      boxShadow: {
        soft: "0 1px 2px 0 rgba(15, 17, 21, 0.04), 0 1px 3px 0 rgba(15, 17, 21, 0.06)",
        card: "0 1px 2px 0 rgba(15, 17, 21, 0.04), 0 8px 24px -8px rgba(15, 17, 21, 0.08)",
        lift: "0 2px 4px 0 rgba(15, 17, 21, 0.05), 0 16px 40px -12px rgba(15, 17, 21, 0.12)",
        ring: "0 0 0 4px rgba(111, 79, 232, 0.12)",
        "brand-glow": "0 12px 32px -8px rgba(10, 133, 84, 0.35)",
        "accent-glow": "0 12px 32px -8px rgba(111, 79, 232, 0.35)"
      },
      backdropBlur: {
        xs: "2px"
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #13924C 0%, #0E7A3F 100%)",
        "accent-gradient": "linear-gradient(135deg, #8A6CFB 0%, #5A3DCC 100%)",
        "hero-gradient":
          "radial-gradient(120% 90% at 50% -10%, #EDF2EC 0%, #E9F3EC 38%, #E6EDE9 72%, #EAEFEA 100%)",
        "shimmer-line":
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)"
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out-expo": "cubic-bezier(0.87, 0, 0.13, 1)"
      }
    }
  },
  plugins: []
};

export default config;
