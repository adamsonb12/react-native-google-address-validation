import { Text, TextProps } from "../text";

export const Paragraph = ({ children, ...props }: TextProps) => {
  return (
    <Text variant="bodyMedium" {...props}>
      {children}
    </Text>
  );
};
