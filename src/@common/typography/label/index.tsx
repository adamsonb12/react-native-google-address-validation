import { Text, TextProps } from "../text";

export const Label = ({ children, ...props }: TextProps) => {
  return (
    <Text variant="labelMedium" {...props}>
      {children}
    </Text>
  );
};
