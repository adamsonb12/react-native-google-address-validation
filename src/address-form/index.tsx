import { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Text, TouchableOpacity, View } from "react-native";

import { AddressField, RegionPicker } from "../address-field";
import { Loading } from "../@common/loading";
import { PrimaryButton } from "../@common/buttons/primary";

import {
  Address,
  getGooglePlacesApiAddressObject,
  validateAddress,
} from "../utils";
import { useDebounce } from "../@common/debounce";
import { RegionCode } from "../region-codes";

const Container = styled(View)`
  flex: 1;
  width: 100%;
`;

const Row = styled(View)`
  margin-top: 12px;
  z-index: 0;
`;

const SplitRow = styled(Row)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const SplitRowCell = styled(View)`
  width: 48%;
`;

const Grower = styled(Row)`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const DropdownResultRow = styled(TouchableOpacity)`
  width: 100%;
  padding: 8px 16px;
`;

const DropdownLoadingRow = styled(View)`
  width: 100%;
  padding: 8px 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 48px;
`;

export const AddressForm = ({
  address,
  googlePlacesApiKey,
  onChange,
  streetOneLabel = "Street Address",
  streetOnePlaceholder = "1600 Amphitheatre Pkwy",
  streetTwoLabel = "Line 2",
  streetTwoPlaceholder = "Apt, suite, or unit",
  localityLabel = "City",
  localityPlaceholder = "City",
  localityClarifier,
  administrativeAreaLabel = "State",
  administrativeAreaPlaceholder = "State",
  postalCodeLabel = "Zip Code",
  postalCodePlaceholder = "123456",
  regionCodeLabel = "Country",
  continueLabel = "Continue",
  onSubmit,
  showErrors = false,
  missingDataErrors,
  regionCodes,
  ...props
}: {
  address: Address;
  googlePlacesApiKey: string;
  onChange: (address: Address) => void;
  streetOneLabel?: string;
  streetOnePlaceholder?: string;
  streetTwoLabel?: string;
  streetTwoPlaceholder?: string;
  localityLabel?: string;
  localityPlaceholder?: string;
  localityClarifier?: string;
  administrativeAreaLabel?: string;
  administrativeAreaPlaceholder?: string;
  postalCodeLabel?: string;
  postalCodePlaceholder?: string;
  regionCodeLabel?: string;
  continueLabel?: string;
  onSubmit: () => void;
  showErrors?: boolean;
  missingDataErrors: Partial<
    Omit<Address, "regionCode"> & {
      regionCode: string;
    }
  > | null;
  regionCodes?: RegionCode[];
}) => {
  const addressErrors = validateAddress(address);
  const debouncedStreetOne = useDebounce(address.streetOne, 300);
  const [streetOneHasFocus, setStreetOneHasFocus] = useState(false);
  const [autoCompleteAddresses, setAutoCompleteAddresses] = useState<
    {
      placeId: string;
      formattedAddress: string;
    }[]
  >([]);
  const [autoCompleteLoading, setAutoCompleteLoading] = useState(false);

  const getAutoCompletedResults = async () => {
    setAutoCompleteLoading(true);
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${debouncedStreetOne}&types=address&key=${googlePlacesApiKey}`
    );
    const data = await response.json();

    if (data?.predictions?.length > 0) {
      setAutoCompleteAddresses(
        data.predictions.map(
          (prediction: { description: string; place_id: string }) => {
            return {
              placeId: prediction.place_id,
              formattedAddress: prediction.description,
            };
          }
        )
      );
    }

    setAutoCompleteLoading(false);
  };

  const onAutoFillAddress = async (placeId: string) => {
    setStreetOneHasFocus(false);

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=address_component&key=${googlePlacesApiKey}`
    );
    const data = await response.json();

    if (data?.result?.address_components?.length > 0) {
      const addressComponents = getGooglePlacesApiAddressObject(
        data.result.address_components
      );

      if (addressComponents) {
        onChange({
          ...address,
          streetOne: addressComponents.streetOne,
          streetTwo: addressComponents.streetTwo ?? "",
          locality:
            addressComponents.locality.length > 17
              ? addressComponents.locality.slice(0, 17)
              : addressComponents.locality,
          administrativeArea: addressComponents.administrativeArea,
          postalCode: addressComponents.postalCode,
          regionCode: addressComponents.country as RegionCode,
        });
      }
    }
  };

  useEffect(() => {
    if (
      streetOneHasFocus &&
      debouncedStreetOne &&
      debouncedStreetOne.trim().length > 3
    ) {
      getAutoCompletedResults();
    }
  }, [debouncedStreetOne]);

  return (
    <Container {...props}>
      <AddressField
        value={address.streetOne}
        label={streetOneLabel}
        placeholder={streetOnePlaceholder}
        onChange={(text) => {
          if (!streetOneHasFocus) {
            setStreetOneHasFocus(true);
          }
          onChange({
            ...address,
            streetOne: text,
          });
        }}
        error={
          showErrors
            ? missingDataErrors?.streetOne ?? addressErrors.streetOne
            : ""
        }
        onBlur={() => setStreetOneHasFocus(false)}
        onFocus={() => setStreetOneHasFocus(true)}
      >
        {streetOneHasFocus && address.streetOne.length > 3 && (
          <>
            {autoCompleteLoading && (
              <DropdownLoadingRow>
                <Loading />
              </DropdownLoadingRow>
            )}
            {!autoCompleteLoading &&
              autoCompleteAddresses.length > 0 &&
              autoCompleteAddresses.map((autoCompletedAddress) => {
                return (
                  <DropdownResultRow
                    key={autoCompletedAddress.placeId}
                    onPress={() =>
                      onAutoFillAddress(autoCompletedAddress.placeId)
                    }
                    style={{
                      elevation: 5,
                    }}
                  >
                    <Text>{autoCompletedAddress.formattedAddress}</Text>
                  </DropdownResultRow>
                );
              })}
          </>
        )}
      </AddressField>

      <Row>
        <AddressField
          value={address.streetTwo}
          label={streetTwoLabel}
          placeholder={streetTwoPlaceholder}
          onChange={(text) => {
            onChange({
              ...address,
              streetTwo: text,
            });
          }}
          error={
            showErrors
              ? missingDataErrors?.streetTwo ?? addressErrors.streetTwo
              : ""
          }
        />
      </Row>

      <Row>
        <AddressField
          value={address.locality}
          label={localityLabel}
          placeholder={localityPlaceholder}
          maxLength={18}
          clarifier={localityClarifier}
          onChange={(text) => {
            onChange({
              ...address,
              locality: text,
            });
          }}
          error={
            showErrors
              ? missingDataErrors?.locality ?? addressErrors.locality
              : ""
          }
        />
      </Row>

      <SplitRow>
        <SplitRowCell>
          <AddressField
            value={address.administrativeArea}
            label={administrativeAreaLabel}
            placeholder={administrativeAreaPlaceholder}
            onChange={(text) => {
              onChange({
                ...address,
                administrativeArea: text,
              });
            }}
            error={
              showErrors
                ? missingDataErrors?.administrativeArea ??
                  addressErrors.administrativeArea
                : ""
            }
          />
        </SplitRowCell>
        <SplitRowCell>
          <AddressField
            value={address.postalCode}
            label={postalCodeLabel}
            placeholder={postalCodePlaceholder}
            onChange={(text) => {
              onChange({
                ...address,
                postalCode: text,
              });
            }}
            error={
              showErrors
                ? missingDataErrors?.postalCode ?? addressErrors.postalCode
                : ""
            }
          />
        </SplitRowCell>
      </SplitRow>

      <Row>
        <RegionPicker
          value={address.regionCode}
          label={regionCodeLabel}
          onChange={(code) => {
            onChange({
              ...address,
              regionCode: code,
            });
          }}
          error={
            showErrors
              ? missingDataErrors?.regionCode ?? addressErrors.regionCode
              : ""
          }
          regionCodes={regionCodes}
        />
      </Row>

      <Grower>
        <PrimaryButton onPress={onSubmit}>{continueLabel}</PrimaryButton>
      </Grower>
    </Container>
  );
};
