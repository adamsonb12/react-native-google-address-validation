import { useState } from "react";
import { Alert } from "react-native";

import { AddressForm } from "./address-form";
import {
  Address,
  FormattedAddress,
  getGoogleAddressFromGooglesAddressComponents,
  getMissingTypeErrors,
  validateAddress,
} from "./utils";
import { AddressSelect } from "./address-select";
import { InvalidAddressConfirmation } from "./invalid-address-confirmation";
import { RegionCode } from "./region-codes";

type Frame =
  | "ADDRESS_INPUT"
  | "CHOOSE_VALID_ADDRESS"
  | "MISSING_INFORMATION"
  | "PROGRESS_WITH_INVALID_ADDRESS";

export const AddressValidation = ({
  address,
  googlePlacesApiKey,
  googleAddressValidationApiKey,
  onChange,
  streetOneLabel = "Street Address",
  streetOnePlaceholder = "1600 Amphitheatre Pkwy",
  streetTwoLabel = "Line 2",
  streetTwoPlaceholder = "Apt, suite, or unit",
  localityLabel = "City",
  localityPlaceholder = "City",
  administrativeAreaLabel = "State",
  administrativeAreaPlaceholder = "State",
  postalCodeLabel = "Zip Code",
  postalCodePlaceholder = "123456",
  regionCodeLabel = "Country",
  continueLabel = "Continue",
  onFinish,
  regionCodes,
  enableUspsCass = false,
  ...props
}: {
  address: Address;
  googlePlacesApiKey: string;
  googleAddressValidationApiKey: string;
  onChange: (address: Address) => void;
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
  onFinish: (address: FormattedAddress) => void;
  regionCodes?: RegionCode[];
  enableUspsCass?: boolean;
}) => {
  const [frame, setFrame] = useState<Frame>("ADDRESS_INPUT");
  const [showFormErrors, setShowFormErrors] = useState(false);
  const [validationLoading, setValidationLoading] = useState(false);
  const [googleAddress, setGoogleAddress] = useState<FormattedAddress | null>(
    null
  );
  const [missingDataErrors, setMissingDataErrors] = useState<Partial<
    Omit<Address, "regionCode"> & {
      regionCode: string;
    }
  > | null>(null);

  const onSubmitForm = async () => {
    setShowFormErrors(true);
    const addressValidationErrors = validateAddress(address);
    const addressHasRequiredElements =
      Object.keys(addressValidationErrors).length === 0;
    setValidationLoading(true);

    if (missingDataErrors) {
      setMissingDataErrors(null);
    }

    const response = await fetch(
      `https://addressvalidation.googleapis.com/v1:validateAddress?key=${googleAddressValidationApiKey}`,
      {
        method: "POST",
        body: JSON.stringify({
          address: {
            addressLines: address.streetTwo
              ? [address.streetOne, address.streetTwo]
              : [address.streetOne],
            locality: address.locality,
            administrativeArea: address.administrativeArea,
            postalCode: address.postalCode,
            regionCode: address.regionCode,
          },
          enableUspsCass: enableUspsCass,
        }),
      }
    );

    const data = await response.json();
    setValidationLoading(false);

    // perfect as is
    if (
      addressHasRequiredElements &&
      data?.result?.verdict?.addressComplete === true &&
      data?.result?.verdict?.hasInferredComponents === false &&
      (data?.result?.verdict?.validationGranularity === "SUB_PREMISE" ||
        data?.result?.verdict?.validationGranularity === "PREMISE")
    ) {
      onFinish({
        streetOne: address.streetOne,
        streetTwo: address.streetTwo,
        locality: address.locality,
        administrativeArea: address.administrativeArea,
        postalCode: address.postalCode,
        country: address.regionCode,
      });
    } else if (
      // google suggested changes
      addressHasRequiredElements &&
      data?.result?.verdict?.addressComplete === true &&
      (data?.result?.verdict?.validationGranularity === "SUB_PREMISE" ||
        data?.result?.verdict?.validationGranularity === "PREMISE") &&
      !data?.result?.address?.missingComponentTypes
    ) {
      const googleFormattedAddress =
        getGoogleAddressFromGooglesAddressComponents(
          data.result.address.addressComponents
        );

      setGoogleAddress(googleFormattedAddress);
      setFrame("CHOOSE_VALID_ADDRESS");
    } else if (data?.result?.address?.missingComponentTypes?.length > 0) {
      const missingData = getMissingTypeErrors(
        data.result.address.missingComponentTypes
      );

      setMissingDataErrors(missingData);
      setFrame("MISSING_INFORMATION");
    } else if (addressHasRequiredElements) {
      // couldn't validate against google but has necessary components, allow progression with confirmation
      setFrame("PROGRESS_WITH_INVALID_ADDRESS");
    } else {
      // could not validate
      Alert.alert(
        "Invalid Address",
        "The entered address could not be verified, please correct the address and try again."
      );
    }
  };

  if (frame === "ADDRESS_INPUT" || frame === "MISSING_INFORMATION") {
    return (
      <AddressForm
        address={address}
        googlePlacesApiKey={googlePlacesApiKey}
        onChange={onChange}
        streetOneLabel={streetOneLabel}
        streetOnePlaceholder={streetOnePlaceholder}
        streetTwoLabel={streetTwoLabel}
        streetTwoPlaceholder={streetTwoPlaceholder}
        localityLabel={localityLabel}
        localityPlaceholder={localityPlaceholder}
        administrativeAreaLabel={administrativeAreaLabel}
        administrativeAreaPlaceholder={administrativeAreaPlaceholder}
        postalCodeLabel={postalCodeLabel}
        postalCodePlaceholder={postalCodePlaceholder}
        regionCodeLabel={regionCodeLabel}
        continueLabel={continueLabel}
        showErrors={showFormErrors}
        onSubmit={onSubmitForm}
        missingDataErrors={missingDataErrors}
        regionCodes={regionCodes}
        {...props}
      />
    );
  }

  if (frame === "CHOOSE_VALID_ADDRESS") {
    return (
      <AddressSelect
        userEnteredAddress={address}
        googleSuggestedAddress={googleAddress as FormattedAddress}
        onCancel={() => {
          setFrame("ADDRESS_INPUT");
          setGoogleAddress(null);
        }}
        onConfirm={(confirmedAddress) => {
          onFinish(confirmedAddress);
        }}
        {...props}
      />
    );
  }

  if (frame === "PROGRESS_WITH_INVALID_ADDRESS") {
    return (
      <InvalidAddressConfirmation
        userEnteredAddress={address}
        onCancel={() => {
          setFrame("ADDRESS_INPUT");
        }}
        onConfirm={() =>
          onFinish({
            streetOne: address.streetOne,
            streetTwo: address.streetTwo,
            locality: address.locality,
            administrativeArea: address.administrativeArea,
            postalCode: address.postalCode,
            country: address.regionCode,
          })
        }
        {...props}
      />
    );
  }

  return null;
};
