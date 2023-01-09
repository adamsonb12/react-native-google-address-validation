import React from "react";
import styled from "styled-components/native";

import { useThemeContext } from "../theme";
import { Button, ButtonProps } from ".";

const StyledButton = styled(Button)`
  background-color: ${(props) => props.theme.colors.primary};
`;

export const PrimaryButton = ({
  onPress,
  children,
  disabled,
  ...props
}: ButtonProps) => {
  const { colors } = useThemeContext();

  return (
    <StyledButton
      onPress={onPress}
      disabled={disabled}
      fontColor={colors.textLight}
      {...props}
    >
      {children}
    </StyledButton>
  );
};
