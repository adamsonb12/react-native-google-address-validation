import { useState } from "react";
import styled from "styled-components/native";
import { Platform, TouchableOpacity, View } from "react-native";

import { Title, TitleSmall } from "../@common/typography/title";
import { Label } from "../@common/typography/label";
import { SecondaryButton } from "../@common/buttons/secondary";
import { PrimaryButton } from "../@common/buttons/primary";
import { Paragraph } from "../@common/typography/paragraph";

import { Address, FormattedAddress } from "../utils";

const Container = styled(View)`
  flex: 1;
  width: 100%;
`;

const CardsContainer = styled(View)`
  padding: 32px 8px;
`;

const Card = styled(TouchableOpacity)<{ isActive: boolean }>`
  border-radius: 8px;
  border-style: solid;
  border-width: 1px;
  border-color: ${(props) =>
    props.isActive ? props.theme.colors.primary : props.theme.colors.neutral};
`;

const GoogleCard = styled(Card)`
  margin-top: 16px;
`;

const CardInfoRow = styled(View)`
  padding: 8px 16px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

const CardInfoSection = styled(View)`
  margin-left: 16px;
`;

const Circle = styled(View)<{ isActive: boolean }>`
  border-radius: ${Platform.OS === "ios" ? "50%" : "50px"};
  border-style: solid;
  border-color: ${(props) =>
    props.isActive ? props.theme.colors.primary : props.theme.colors.neutral};
  border-width: 2px;
  width: 24px;
  height: 24px;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ActiveInnerCircle = styled(View)`
  border-radius: ${Platform.OS === "ios" ? "50%" : "50px"};
  background-color: ${(props) => props.theme.colors.primary};
  width: 12px;
  height: 12px;
`;

const CardInfoTitle = styled(TitleSmall)`
  font-weight: bold;
`;

const CardInfoAddressSection = styled(View)`
  margin-top: 8px;
`;

const Grower = styled(View)`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin-top: 12px;
`;

const ButtonsContainer = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const AddressSelect = ({
  userEnteredAddress,
  googleSuggestedAddress,
  onConfirm,
  onCancel,
  confirmationTitle = "Confirm your address",
  confirmationSubtitle = "Review the recommended changes",
  userAddressLabel = "What you entered",
  googleRecommendedLabel = "Recommended",
  cancelLabel = "Back",
  submitLabel = "Next",
  ...props
}: {
  userEnteredAddress: Address;
  googleSuggestedAddress: FormattedAddress;
  onConfirm: (address: FormattedAddress) => void;
  onCancel: () => void;
  confirmationTitle?: string;
  confirmationSubtitle?: string;
  userAddressLabel?: string;
  googleRecommendedLabel?: string;
  cancelLabel?: string;
  submitLabel?: string;
}) => {
  const [selectedAddress, setSelectedAddress] = useState<"USER" | "GOOGLE">(
    "GOOGLE"
  );

  return (
    <Container {...props}>
      <Title>{confirmationTitle}</Title>
      <Label>{confirmationSubtitle}</Label>

      <CardsContainer>
        <Card
          onPress={() => setSelectedAddress("USER")}
          isActive={selectedAddress === "USER"}
        >
          <CardInfoRow>
            <Circle isActive={selectedAddress === "USER"}>
              {selectedAddress === "USER" && <ActiveInnerCircle />}
            </Circle>
            <CardInfoSection>
              <CardInfoTitle>{userAddressLabel}</CardInfoTitle>
              <CardInfoAddressSection>
                <Paragraph>{`${userEnteredAddress.streetOne} ${userEnteredAddress.streetTwo}`}</Paragraph>
                <Paragraph>{`${userEnteredAddress.locality}, ${userEnteredAddress.administrativeArea} ${userEnteredAddress.postalCode} ${userEnteredAddress.regionCode}`}</Paragraph>
              </CardInfoAddressSection>
            </CardInfoSection>
          </CardInfoRow>
        </Card>

        <GoogleCard
          onPress={() => setSelectedAddress("GOOGLE")}
          isActive={selectedAddress === "GOOGLE"}
        >
          <CardInfoRow>
            <Circle isActive={selectedAddress === "GOOGLE"}>
              {selectedAddress === "GOOGLE" && <ActiveInnerCircle />}
            </Circle>
            <CardInfoSection>
              <CardInfoTitle>{googleRecommendedLabel}</CardInfoTitle>
              <CardInfoAddressSection>
                <Paragraph>{`${googleSuggestedAddress.streetOne} ${googleSuggestedAddress.streetTwo}`}</Paragraph>
                <Paragraph>{`${googleSuggestedAddress.locality}, ${googleSuggestedAddress.administrativeArea} ${googleSuggestedAddress.postalCode} ${googleSuggestedAddress.country}`}</Paragraph>
              </CardInfoAddressSection>
            </CardInfoSection>
          </CardInfoRow>
        </GoogleCard>
      </CardsContainer>

      <Grower>
        <ButtonsContainer>
          <SecondaryButton onPress={onCancel}>{cancelLabel}</SecondaryButton>
          <PrimaryButton
            onPress={() => {
              if (selectedAddress === "USER") {
                onConfirm({
                  streetOne: userEnteredAddress.streetOne,
                  streetTwo: userEnteredAddress.streetTwo,
                  locality: userEnteredAddress.locality,
                  administrativeArea: userEnteredAddress.administrativeArea,
                  postalCode: userEnteredAddress.postalCode,
                  country: userEnteredAddress.regionCode,
                });
              }

              if (selectedAddress === "GOOGLE") {
                onConfirm(googleSuggestedAddress);
              }
            }}
          >
            {submitLabel}
          </PrimaryButton>
        </ButtonsContainer>
      </Grower>
    </Container>
  );
};
