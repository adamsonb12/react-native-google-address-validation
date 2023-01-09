import { ReactNode } from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { Text } from "../typography/text";
import { useThemeContext } from "../theme";

const ButtonContainer = styled(TouchableOpacity)`
  width: 100%;
  border-radius: 10px;
  padding: 12px 0;
  min-width: 64px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const Button = ({
  children,
  onPress,
  disabled,
  fontColor,
  ...props
}: ButtonProps) => {
  const { colors } = useThemeContext();

  return (
    <ButtonContainer onPress={onPress} disabled={disabled} {...props}>
      <Text
        style={{
          color: fontColor ?? colors.textLight,
        }}
      >
        {children}
      </Text>
    </ButtonContainer>
  );
};

export interface ButtonProps {
  children: ReactNode;
  onPress: () => void;
  disabled?: boolean;
  fontColor?: string;
}
