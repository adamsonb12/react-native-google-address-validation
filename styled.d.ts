import { ThemeColors } from "./src/@common/theme/types";

declare module "styled-components/native" {
  export interface DefaultTheme {
    colors: ThemeColors;
  }
}
