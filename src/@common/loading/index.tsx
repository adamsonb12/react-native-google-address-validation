import { ActivityIndicator } from "react-native";

export const Loading = ({ ...props }) => (
  <ActivityIndicator animating={true} {...props} />
);
