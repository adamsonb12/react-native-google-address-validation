import { Text, TextProps } from "../text";

export const Title = ({ children, ...props }: TextProps) => {
  return (
    <Text variant="titleMedium" {...props}>
      {children}
    </Text>
  );
};

export const TitleSmall = ({ children, ...props }: TextProps) => {
  return (
    <Text variant="titleSmall" {...props}>
      {children}
    </Text>
  );
};
