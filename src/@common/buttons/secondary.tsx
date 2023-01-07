import React, { ReactNode } from "react";
import { Button, ButtonProps } from "react-native-paper";
import styled from "styled-components/native";

import { Text } from "../typography/text";

import { useThemeContext } from "../theme";

const StyledText = styled(Text)`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.colors.primary};
`;

export const SecondaryButton = ({
  onPress,
  children,
  disabled,
  mode = "outlined",
  ...props
}: {
  onPress: () => void;
  children: ReactNode;
  disabled?: boolean;
  mode?: "text" | "outlined" | "contained" | "elevated" | "contained-tonal";
} & Partial<ButtonProps>) => {
  const { colors } = useThemeContext();

  return (
    <Button
      mode={mode}
      onPress={onPress}
      theme={{
        colors: {
          primary: colors.primary,
        },
      }}
      style={{
        borderColor: colors.neutral,
      }}
      disabled={disabled}
      {...props}
    >
      <StyledText>{children}</StyledText>
    </Button>
  );
};
