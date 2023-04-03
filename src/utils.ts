import { RegionCode } from "./region-codes";

export const validateAddress = (address: Address) => {
  let errors: Partial<
    Omit<Address, "regionCode"> & {
      regionCode: string;
    }
  > = {};

  if (!address.streetOne) {
    errors = { ...errors, streetOne: "Street address is required" };
  }

  if (!address.locality) {
    errors = { ...errors, locality: "City is required" };
  }

  if (!address.administrativeArea) {
    errors = { ...errors, administrativeArea: "State/Region is required" };
  }

  if (!address.postalCode) {
    errors = { ...errors, postalCode: "Zipcode is required" };
  }

  if (!address.regionCode) {
    errors = { ...errors, regionCode: "Country is required" };
  }

  return errors;
};

export enum ConfirmationLevel {
  CONFIRMATION_LEVEL_UNSPECIFIED = "CONFIRMATION_LEVEL_UNSPECIFIED",
  CONFIRMED = "CONFIRMED",
  UNCONFIRMED_BUT_PLAUSIBLE = "UNCONFIRMED_BUT_PLAUSIBLE",
  UNCONFIRMED_AND_SUSPICIOUS = "UNCONFIRMED_AND_SUSPICIOUS",
}

export interface AddressComponent {
  componentName: {
    text: string;
    languageCode: string;
  };
  componentType: string;
  confirmationLevel: ConfirmationLevel;
  inferred: boolean;
  spellCorrected: boolean;
  replaced: boolean;
  unexpected: boolean;
}

export interface Address {
  streetOne: string;
  streetTwo: string;
  locality: string; // city
  administrativeArea: string; // state
  postalCode: string;
  regionCode: RegionCode; // country code
}

export interface FormattedAddress extends Omit<Address, "regionCode"> {
  country: string;
}

export interface BrokenDownAddress {
  home: string | string[];
  street: string | string[];
  streetLineTwo?: string | string[];
  locality: string | string[];
  administrativeArea: string | string[];
  postalCode: string | string[];
  country: string | string[];
}

// Parse google api details address components to our Address Object
export const getGoogleAddressFromGooglesAddressComponents = (
  addressComponents: AddressComponent[]
): FormattedAddress => {
  const addressComponentCategories: BrokenDownAddress = {
    home: ["street_number"],
    street: ["street_address", "route"],
    streetLineTwo: ["subpremise"],
    locality: [
      "locality",
      "sublocality",
      "sublocality_level_1",
      "sublocality_level_2",
      "sublocality_level_3",
      "sublocality_level_4",
      "sublocality_level_5",
    ],
    administrativeArea: [
      "administrative_area_level_1",
      "administrative_area_level_2",
      "administrative_area_level_3",
      "administrative_area_level_4",
      "administrative_area_level_5",
      "administrative_area_level_6",
      "administrative_area_level_7",
    ],
    postalCode: ["postal_code"],
    country: ["country"],
  };

  const brokenDownAddress: BrokenDownAddress = {
    home: "",
    street: "",
    streetLineTwo: "",
    locality: "",
    administrativeArea: "",
    postalCode: "",
    country: "",
  };

  addressComponents.forEach((component) => {
    for (const category in addressComponentCategories) {
      if (
        // @ts-ignore
        addressComponentCategories[category].indexOf(
          component.componentType
        ) !== -1
      ) {
        // @ts-ignore
        brokenDownAddress[category] = component.componentName.text;
      }
    }
  });

  return {
    streetOne: `${brokenDownAddress.home} ${brokenDownAddress.street}`,
    streetTwo: (brokenDownAddress.streetLineTwo as string) ?? "",
    locality: brokenDownAddress.locality as string,
    administrativeArea: brokenDownAddress.administrativeArea as string,
    postalCode: brokenDownAddress.postalCode as string,
    country: brokenDownAddress.country as string,
  };
};

interface GooglePlacesAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

// Parse google api details address components to our Address Object
// Places address components have a different shape
export const getGooglePlacesApiAddressObject = (
  addressComponents: GooglePlacesAddressComponent[]
): FormattedAddress => {
  const addressComponentCategories = {
    home: ["street_number"],
    street: ["street_address", "route"],
    streetLineTwo: ["subpremise"],
    postal_code: ["postal_code"],
    region: [
      "administrative_area_level_1",
      "administrative_area_level_2",
      "administrative_area_level_3",
      "administrative_area_level_4",
      "administrative_area_level_5",
    ],
    city: [
      "locality",
      "sublocality",
      "sublocality_level_1",
      "sublocality_level_2",
      "sublocality_level_3",
      "sublocality_level_4",
    ],
    country: ["country"],
  };

  const address = {
    home: "",
    postal_code: "",
    street: "",
    streetLineTwo: "",
    region: "",
    city: "",
    country: "",
  };

  addressComponents.forEach((component) => {
    for (const category in addressComponentCategories) {
      if (
        // @ts-ignore
        addressComponentCategories[category].indexOf(component.types[0]) !== -1
      ) {
        if (category === "country") {
          address[category] = component.short_name;
        } else {
          // @ts-ignore
          address[category] = component.long_name;
        }
      }
    }
  });

  return {
    streetOne: `${address.home} ${address.street}`.trim(),
    streetTwo: address.streetLineTwo.trim(),
    locality: address.city.trim(),
    administrativeArea: address.region.trim(),
    postalCode: address.postal_code.trim(),
    country: address.country.trim(),
  };
};

type MissingType =
  | "street_address"
  | "street_number"
  | "route"
  | "intersection"
  | "political"
  | "country"
  | "administrative_area_level_1"
  | "administrative_area_level_2"
  | "administrative_area_level_3"
  | "administrative_area_level_4"
  | "administrative_area_level_5"
  | "administrative_area_level_6"
  | "administrative_area_level_7"
  | "colloquial_area"
  | "locality"
  | "sublocality"
  | "neighborhood"
  | "premise"
  | "subpremise"
  | "plus_code"
  | "postal_code"
  | "natural_feature"
  | "airport"
  | "park"
  | "point_of_interest";

export const getMissingTypeErrors = (missingTypes: MissingType[]) => {
  let errors: Partial<
    Omit<Address, "regionCode"> & {
      regionCode: string;
    }
  > = {};

  const streetMissing: MissingType[] = [
    "street_address",
    "street_number",
    "premise",
    "route",
  ];
  const streetTwoMissing: MissingType[] = ["subpremise"];
  const localityMissing: MissingType[] = ["locality", "sublocality"];
  const administrativeAreaMissing: MissingType[] = [
    "administrative_area_level_1",
    "administrative_area_level_2",
    "administrative_area_level_3",
    "administrative_area_level_4",
    "administrative_area_level_5",
    "administrative_area_level_6",
    "administrative_area_level_7",
  ];
  const countryMissing: MissingType[] = ["country", "political"];

  if (missingTypes.find((type) => streetMissing.includes(type))) {
    errors = { ...errors, streetOne: "Missing or incomplete information" };
  }

  if (missingTypes.find((type) => streetTwoMissing.includes(type))) {
    errors = { ...errors, streetTwo: "Missing or incomplete information" };
  }

  if (missingTypes.find((type) => localityMissing.includes(type))) {
    errors = { ...errors, locality: "Missing or incomplete information" };
  }

  if (missingTypes.find((type) => administrativeAreaMissing.includes(type))) {
    errors = {
      ...errors,
      administrativeArea: "Missing or incomplete information",
    };
  }

  if (missingTypes.find((type) => countryMissing.includes(type))) {
    errors = { ...errors, regionCode: "Missing or incomplete information" };
  }

  return errors;
};
