import { ThemeProvider as StyledComponentsThemeProvider } from "styled-components/native";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";

import { AddressValidation as AddressValidationWorkflow } from "./src";
import { ThemeProvider } from "./src/@common/theme";
import { defaultTheme } from "./src/@common/theme/default-theme";
import { Address, FormattedAddress } from "./src/utils";

export type { RegionCode } from "./src/region-codes";
export type { FormattedAddress, Address } from "./src/utils";

export interface AddressValidationProps {
  // validator props
  address: Address;
  googlePlacesApiKey: string;
  googleAddressValidationApiKey: string;
  onChange: (address: Address) => void;
  onFinish: (address: FormattedAddress) => void;
  // content props
  streetOneLabel?: string;
  streetOnePlaceholder?: string;
  streetTwoLabel?: string;
  streetTwoPlaceholder?: string;
  localityLabel?: string;
  localityPlaceholder?: string;
  administrativeAreaLabel?: string;
  administrativeAreaPlaceholder?: string;
  postalCodeLabel?: string;
  postalCodePlaceholder?: string;
  regionCodeLabel?: string;
  continueLabel?: string;
  // theming props
  primaryColor?: string;
  successColor?: string;
  dangerColor?: string;
  warningColor?: string;
  backgroundColor?: string;
  textColor?: string;
  textLightColor?: string;
  disabledColor?: string;
  neutralColor?: string;
  placeholderColor?: string;
}

export const AddressValidation = ({
  primaryColor,
  successColor,
  dangerColor,
  warningColor,
  backgroundColor,
  textColor,
  textLightColor,
  disabledColor,
  neutralColor,
  placeholderColor,
  ...props
}: AddressValidationProps) => {
  const defaultColors = {
    primary: primaryColor ?? defaultTheme.primary,
    success: successColor ?? defaultTheme.success,
    danger: dangerColor ?? defaultTheme.danger,
    warning: warningColor ?? defaultTheme.warning,
    background: backgroundColor ?? defaultTheme.background,
    text: textColor ?? defaultTheme.text,
    textLight: textLightColor ?? defaultTheme.textLight,
    disabled: disabledColor ?? defaultTheme.disabled,
    neutral: neutralColor ?? defaultTheme.neutral,
    placeholder: placeholderColor ?? defaultTheme.placeholder,
  };
  return (
    <ThemeProvider defaultColors={{ ...defaultColors }}>
      <StyledComponentsThemeProvider
        theme={{
          colors: defaultColors,
        }}
      >
        <PaperProvider
          theme={{
            ...DefaultTheme,
            colors: {
              ...DefaultTheme.colors,
              ...defaultColors,
            },
          }}
        >
          <AddressValidationWorkflow {...props} />
        </PaperProvider>
      </StyledComponentsThemeProvider>
    </ThemeProvider>
  );
};
