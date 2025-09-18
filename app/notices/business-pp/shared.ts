export type NoticeFormData = {
  parcel_number: string;
  site_address: string;
  name: string;
  address_1: string;
  city: string;
  state: string;
  zip: string;
  av: string;
  mv: string;
};

export const REQUIRED_HEADERS = [
  "parcel_number",
  "site_address",
  "name",
  "address_1",
  "city",
  "state",
  "zip",
  "av",
  "mv",
] as const satisfies ReadonlyArray<keyof NoticeFormData>;

export type RequiredHeader = (typeof REQUIRED_HEADERS)[number];
