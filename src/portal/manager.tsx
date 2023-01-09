import * as React from "react";
import { View, StyleSheet } from "react-native";

type State = {
  portals: Array<{
    key: number;
    children: React.ReactNode;
  }>;
};

// eslint-disable-next-line
export default class PortalManager extends React.PureComponent<{}, State> {
  state: State = {
    portals: [],
  };

  mount = (key: number, children: React.ReactNode) => {
    this.setState((state) => ({
      portals: [...state.portals, { key, children }],
    }));
  };

  update = (key: number, children: React.ReactNode) =>
    this.setState((state) => ({
      portals: state.portals.map((item) => {
        if (item.key === key) {
          return { ...item, children };
        }
        return item;
      }),
    }));

  unmount = (key: number) =>
    this.setState((state) => ({
      portals: state.portals.filter((item) => item.key !== key),
    }));

  render() {
    return this.state.portals.map(({ key, children }) => (
      <View
        key={key}
        collapsable={false}
        pointerEvents="box-none"
        style={StyleSheet.absoluteFill}
      >
        {children}
      </View>
    ));
  }
}
