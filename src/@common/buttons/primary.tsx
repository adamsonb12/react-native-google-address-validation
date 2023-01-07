import React, { ReactNode } from "react";
import { Button, ButtonProps } from "react-native-paper";
import styled from "styled-components/native";

import { Text } from "../typography/text";
import { useThemeContext } from "../theme";

const StyledText = styled(Text)`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.colors.textLight};
`;

export const PrimaryButton = ({
  onPress,
  children,
  mode = "contained",
  disabled,
  ...props
}: {
  onPress: () => void;
  children: ReactNode;
  mode?: "text" | "outlined" | "contained" | "elevated" | "contained-tonal";
  disabled?: boolean;
} & Partial<ButtonProps>) => {
  const { colors } = useThemeContext();

  return (
    <Button
      buttonColor={disabled ? colors.disabled : colors.primary}
      mode={mode}
      onPress={onPress}
      disabled={disabled}
      {...props}
    >
      <StyledText>{children}</StyledText>
    </Button>
  );
};
