import { ReactNode, useEffect, useState } from "react";
import { TextInput, View } from "react-native";
import styled from "styled-components/native";
import DropDownPicker from "react-native-dropdown-picker";
import { Portal } from "react-native-paper";

import { Label } from "../@common/typography/label";
import { Text } from "../@common/typography/text";

import { useThemeContext } from "../@common/theme";
import { RegionCode } from "../region-codes";
import { regions } from "./regions";
import { elevation } from "../@common/elevation";

const FieldContainer = styled(View)`
  width: 100%;
  z-index: 1;
`;

const InputWrapper = styled(View)`
  width: 100%;
  position: relative;
  overflow: visible;
`;

const AddressLabel = styled(Label)`
  margin-bottom: 4px;
`;

const AddressInput = styled(TextInput)<{ hasError?: boolean }>`
  background-color: transparent;
  border-color: ${(props) =>
    props.hasError ? props.theme.colors.danger : props.theme.colors.neutral};
  border-width: 1px;
  border-style: solid;
  padding: 20px 16px 16px 16px;
  border-radius: 4px;
  width: 100%;
`;

const Error = styled(Text)`
  font-size: 10px;
  color: ${(props) => props.theme.colors.danger};
  margin-top: 8px;
  margin-left: 2px;
  z-index: 0;
`;

export const AddressField = ({
  value,
  label,
  placeholder,
  onChange,
  error = "",
  onFocus,
  onBlur,
  children,
}: {
  value: string;
  label: string;
  placeholder: string;
  onChange: (v: string) => void;
  error?: string;
  children?: ReactNode;
  onFocus?: () => void;
  onBlur?: () => void;
}) => {
  return (
    <FieldContainer>
      <AddressLabel>{label}</AddressLabel>
      <AddressInput
        value={value}
        placeholder={placeholder}
        onChangeText={(text: string) => onChange(text)}
        onFocus={onFocus}
        onBlur={onBlur}
        hasError={!!error}
      />
      <ChildrenWrapper>{children}</ChildrenWrapper>
      <Error>{error}</Error>
    </FieldContainer>
  );
};

const DropdownContainer = styled(View)`
  background-color: ${(props) => props.theme.colors.background};
  width: 100%;
  position: absolute;

  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
  border-left-style: solid;
  border-left-width: 1px;
  border-left-color: ${(props) => props.theme.colors.neutral};
  border-right-style: solid;
  border-right-width: 1px;
  border-right-color: ${(props) => props.theme.colors.neutral};
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.colors.neutral};
`;

const ChildrenWrapper = ({ children }: { children: ReactNode }) => {
  const [pageY, setPageY] = useState(0);
  const [pageX, setPageX] = useState(0);
  const [width, setWidth] = useState(0);

  if (children) {
    return (
      <InputWrapper
        collapsable={false}
        onLayout={(event) => {
          event.target?.measure((x, y, width, height, screenX, screenY) => {
            setPageY(screenY);
            setPageX(screenX);
            setWidth(width);
          });
        }}
      >
        <Portal>
          <DropdownContainer
            style={{
              ...elevation,
              top: pageY,
              left: pageX,
              width,
            }}
          >
            {children}
          </DropdownContainer>
        </Portal>
      </InputWrapper>
    );
  }

  return null;
};

export const RegionPicker = ({
  value: defaultValue = "US",
  label,
  onChange,
  error = "",
}: {
  value: RegionCode;
  label: string;
  onChange: (v: RegionCode) => void;
  error?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<RegionCode>(defaultValue);
  const [items, setitems] = useState(
    regions.sort((a, b) => {
      if (a.value === "US") {
        return -1;
      }

      if (b.value === "US") {
        return 1;
      }

      return 0;
    })
  );
  const { colors } = useThemeContext();

  useEffect(() => {
    if (!value && !defaultValue) {
      onChange("US");
    }
  }, []);

  useEffect(() => {
    if (value && value !== defaultValue) {
      onChange(value);
    }
  }, [value]);

  useEffect(() => {
    if (value !== defaultValue && defaultValue) {
      setValue(defaultValue);
    }
  }, [defaultValue]);

  return (
    <FieldContainer>
      <AddressLabel>{label}</AddressLabel>
      <DropDownPicker
        value={value}
        open={open}
        setOpen={setOpen}
        items={items}
        setValue={setValue}
        style={{
          borderColor: error ? colors.danger : colors.neutral,
          borderRadius: 4,
        }}
        listMode="MODAL"
      />
      <Error>{error}</Error>
    </FieldContainer>
  );
};
