import { ActivityIndicator } from "react-native-paper";

export const Loading = ({ ...props }) => (
  <ActivityIndicator animating={true} {...props} />
);
