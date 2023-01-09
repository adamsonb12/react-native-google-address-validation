import styled from "styled-components/native";
import { ReactNode } from "react";
import { Text as NativeText } from "react-native";

export const Text = styled(NativeText).attrs({
  maxFontSizeMultiplier: 1.3,
  minimumFontScale: 0.8,
})`
  color: ${(props) => props.theme.colors.text};
`;

export interface TextProps {
  children: ReactNode;
}
