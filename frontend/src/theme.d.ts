// theme.d.ts
import { PaletteOptions, Palette } from "@mui/material/styles/createPalette";
import {
  TypographyVariants,
  TypographyVariantsOptions,
} from "@mui/material/styles/createTypography";

declare module "@mui/material/styles/createPalette" {
  interface Palette {
    background: Palette["background"] & {
      white: string;
    };
    text: Palette["text"] & {
      dark: string;
    };
  }

  interface PaletteOptions {
    background?: PaletteOptions["background"] & {
      white?: string;
    };
    text?: PaletteOptions["text"] & {
      dark?: string;
    };
  }
}

declare module "@mui/material/styles/createTypography" {
  interface TypographyVariants {
    link: React.CSSProperties;
    cardTitle: React.CSSProperties;
    h7: React.CSSProperties;
    h8: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    link?: React.CSSProperties;
    cardTitle?: React.CSSProperties;
    h7?: React.CSSProperties;
    h8?: React.CSSProperties;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    link: true;
    cardTitle: true;
    h7: true;
    h8: true;
  }
}
