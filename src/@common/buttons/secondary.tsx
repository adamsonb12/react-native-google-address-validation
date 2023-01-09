import React from "react";
import styled from "styled-components/native";

import { useThemeContext } from "../theme";
import { Button, ButtonProps } from ".";

const StyledButton = styled(Button)`
  background-color: ${(props) => props.theme.colors.background};
  border-width: 1px;
  border-style: solid;
  border-color: ${(props) => props.theme.colors.neutral};
`;

export const SecondaryButton = ({
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
      fontColor={colors.primary}
      {...props}
    >
      {children}
    </StyledButton>
  );
};
