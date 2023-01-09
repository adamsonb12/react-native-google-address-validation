import styled from "styled-components/native";
import { View } from "react-native";

import { Title, TitleSmall } from "../@common/typography/title";
import { Label } from "../@common/typography/label";
import { SecondaryButton } from "../@common/buttons/secondary";
import { PrimaryButton } from "../@common/buttons/primary";
import { Paragraph } from "../@common/typography/paragraph";

import { Address } from "../utils";

const Container = styled(View)`
  flex: 1;
  width: 100%;
`;

const CardsContainer = styled(View)`
  padding: 32px 8px;
`;

const Card = styled(View)`
  border-radius: 8px;
  border-style: solid;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.primary};
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

const Circle = styled(View)`
  border-radius: 50%;
  border-style: solid;
  border-color: ${(props) => props.theme.colors.primary};
  border-width: 2px;
  width: 24px;
  height: 24px;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ActiveInnerCircle = styled(View)`
  border-radius: 50%;
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

export const InvalidAddressConfirmation = ({
  userEnteredAddress,
  onConfirm,
  onCancel,
  confirmationTitle = "We could not validate your address",
  confirmationSubtitle = "Please confirm the address below is correct",
  userAddressLabel = "What you entered",
  cancelLabel = "Back",
  submitLabel = "Next",
  ...props
}: {
  userEnteredAddress: Address;
  onConfirm: () => void;
  onCancel: () => void;
  confirmationTitle?: string;
  confirmationSubtitle?: string;
  userAddressLabel?: string;
  googleRecommendedLabel?: string;
  cancelLabel?: string;
  submitLabel?: string;
}) => {
  return (
    <Container {...props}>
      <Title>{confirmationTitle}</Title>
      <Label>{confirmationSubtitle}</Label>

      <CardsContainer>
        <Card>
          <CardInfoRow>
            <Circle>
              <ActiveInnerCircle />
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
      </CardsContainer>

      <Grower>
        <ButtonsContainer>
          <SecondaryButton onPress={onCancel}>{cancelLabel}</SecondaryButton>
          <PrimaryButton onPress={onConfirm}>{submitLabel}</PrimaryButton>
        </ButtonsContainer>
      </Grower>
    </Container>
  );
};
