// Canonical keys used in code (snake_case)
export type AbstractFormData = {
  date_filed: string;
  daily_no: string;
  type_of_conveyance: string;
  date_of_deed: string;
  from: string;
  to: string;
  to_address: string;
  consideration: string;
  stamps: string;
  city_block: string;
  legal_description: string;
  abstract: string;
  sp_tax: string;
  transfer: string;
  mortgage: string;
  title_co: string;
};

// Raw TSV headers (from the file) -> canonical keys
export const HEADER_MAP = {
  "DATE FILED": "date_filed",
  "DAILY NO": "daily_no",
  "TYPE OF CONVEYANCE": "type_of_conveyance",
  "DATE OF DEED": "date_of_deed",
  FROM: "from",
  TO: "to",
  "TO ADDRESS": "to_address",
  CONSIDERATION: "consideration",
  STAMPS: "stamps",
  "CITY BLOCK": "city_block",
  "LEGAL DESCRIPTION": "legal_description",
  ABSTRACT: "abstract",
  "SP TAX": "sp_tax",
  TRANSFER: "transfer",
  MORTGAGE: "mortgage",
  "TITLE CO": "title_co",
} as const;

type HeaderMap = typeof HEADER_MAP;
export type CanonicalKey = HeaderMap[keyof HeaderMap];

// The canonical “required headers” (keys of AbstractFormData), enforced by TS
export const REQUIRED_HEADERS = [
  "date_filed",
  "daily_no",
  "type_of_conveyance",
  "date_of_deed",
  "from",
  "to",
  "to_address",
  "consideration",
  "stamps",
  "city_block",
  "legal_description",
  "abstract",
  "sp_tax",
  "transfer",
  "mortgage",
  "title_co",
] as const satisfies ReadonlyArray<keyof AbstractFormData>;

// Display order for rendering (derived from HEADER_MAP order)
export const DISPLAY_ORDER: { raw: keyof HeaderMap; key: CanonicalKey }[] = (
  Object.keys(HEADER_MAP) as Array<keyof HeaderMap>
).map((raw) => ({
  raw,
  key: HEADER_MAP[raw],
}));
