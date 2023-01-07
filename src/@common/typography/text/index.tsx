import styled from "styled-components/native";
import { Text as PaperText } from "react-native-paper";
import { ReactNode } from "react";

export const Text = styled(PaperText).attrs({
  maxFontSizeMultiplier: 1.3,
  minimumFontScale: 0.8,
})`
  color: ${(props) => props.theme.colors.text};
`;

export interface TextProps {
  children: ReactNode;
}
