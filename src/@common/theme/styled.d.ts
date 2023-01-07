import { ThemeColors } from "./types";

declare module "styled-components/native" {
  export interface DefaultTheme {
    colors: ThemeColors;
  }
}
