# React Native Google Address Validation

**React Native component for user address input, auto complete, and address validation using Google's Places and Address Valdation API's**

## Getting Started

### Installation

```
yarn add react-native-google-address-validation
```

or

```
npm install react-native-google-address-validation --save
```

### Acquire Google API keys

You need a [Google Places API Key](https://developers.google.com/maps/documentation/places/web-service/get-api-key/) and a [Google Address Validation API Key](https://developers.google.com/maps/documentation/address-validation/get-api-key). Enable Web services for both (not IOS or Android). You can generate one key that has access to both API's, or two separate keys, whichever works best for your project.

## Usage

Wrap your root component in the ReactNativeGoogleAddressValidationPortalProvider from react-native-google-address-validation.

It's required for the autocomplete to function correctly on both IOS and Android.

```js
import { ReactNativeGoogleAddressValidationPortalProvider } from "react-native-google-address-validation";
import App from "./src/App";

export default function App() {
  <ReactNativeGoogleAddressValidationPortalProvider>
    <App />
  </ReactNativeGoogleAddressValidationPortalProvider>;
}
```

### Basic Example

Once you have the provider in place wrapping your app, you can use the AddressValidation component anywhere you want in your app, though it will look best if it's the primary focus on the screen.

```js
import {
  AddressValidation,
  Address,
} from "react-native-google-address-validation";

export const UserInputAddressScreen = () => {
  const [address, setAddress] =
    useState <
    Address >
    {
      streetOne: "",
      streetTwo: "",
      locality: "",
      administrativeArea: "",
      postalCode: "",
      regionCode: "US",
    };

  return (
    <StyledAddressForm
      address={{
        streetOne: address.streetOne,
        streetTwo: address.streetTwo ?? "",
        locality: address.city,
        administrativeArea: address.state,
        postalCode: address.postalCode,
        regionCode: address.regionCode,
      }}
      onChange={(updatedAddress) => setAddress(updatedAddress)}
      onFinish={(confirmedAddress) => console.log(confirmedAddress)}
      googlePlacesApiKey={GOOGLE_PLACES_KEY}
      googleAddressValidationApiKey={GOOGLE_ADDRESS_VALIDATION_KEY}
    />
  );
};
```

One this to remember here, is that the onChange returns an in-progress address, which has a regionCode, see type Address. Once the address has been validated by Google and confirmed by the user, it becomes a FormattedAddress type with a country instead of a region code, which could be formatted by google differently than a strict region code.

## Customization

Styles and content can be customized so that colors of the workflow match your app's theme and tone.

```js
import {
  AddressValidation,
  Address,
} from "react-native-google-address-validation";

export const UserInputAddressScreen = () => {
  const [address, setAddress] =
    useState <
    Address >
    {
      streetOne: "",
      streetTwo: "",
      locality: "",
      administrativeArea: "",
      postalCode: "",
      regionCode: "US",
    };

  return (
    <StyledAddressForm
      address={{
        streetOne: address.streetOne,
        streetTwo: address.streetTwo ?? "",
        locality: address.city,
        administrativeArea: address.state,
        postalCode: address.postalCode,
        regionCode: address.regionCode,
      }}
      onChange={(updatedAddress) => setAddress(updatedAddress)}
      onFinish={(confirmedAddress) => console.log(confirmedAddress)}
      googlePlacesApiKey={GOOGLE_PLACES_KEY}
      googleAddressValidationApiKey={GOOGLE_ADDRESS_VALIDATION_KEY}
      // label & content customization
      streetOneLabel="Home sweet home"
      streetOnePlaceholder="Your home street address"
      streetTwoLabel="Line 2 of your home address"
      streetTwoPlaceholder="The Planet Hoth"
      localityLabel="City or Munucipality"
      localityPlaceholder="Tosche Station"
      administrativeAreaLabel="State/Region"
      administrativeAreaPlaceholder="The Northlands"
      postalCodeLabel="Zip code"
      postalCodePlaceholder="zip zip zip"
      regionCodeLabel="Country/Nation"
      continueLabel="Tatooine"
      // Theming Options
      primaryColor="royalblue"
      successColor="green"
      dangerColor="crimson"
      warningColor="orange"
      backgroundColor="#FFF"
      textColor="#000"
      textLightColor="#FFF"
      disabledColor="grey"
      neutralColor="#e6e6e6"
      placeholderColor="#E6E6E6"
    />
  );
};
```
