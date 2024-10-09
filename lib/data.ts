import { createClient } from "@/utils/supabase/server";

/*
CREATE TABLE parcels (
    AsrParcelId BIGINT PRIMARY KEY,
    LowAddrNum INTEGER,
    HighAddrNum INTEGER,
    StPreDir VARCHAR(10),
    StName VARCHAR(255),
    StType VARCHAR(50),
    ZIP VARCHAR(10),
    OwnerName VARCHAR(255),
    AsrClassCode INTEGER,
    PropertyClassCode INTEGER,
    AsrLandUse1 VARCHAR(50),
    IsAbatedProperty BOOLEAN,
    AbatementType VARCHAR(50),
    AbatementStartYear INTEGER,
    AbatementEndYear INTEGER,
    RedevPhase VARCHAR(50),
    RedevYearEnd INTEGER,
    RedevPhase2 VARCHAR(50),
    RedevYearEnd2 INTEGER,
    VacantLot BOOLEAN,
    SpecBusDist VARCHAR(50),
    TIFDist VARCHAR(50),
    Condominium BOOLEAN,
    NbrOfUnits INTEGER,
    NbrOfApts INTEGER,
    LandArea NUMERIC,
    AsdTotal NUMERIC,
    AsdResLand NUMERIC,
    AsdResImprove NUMERIC,
    AsdComLand NUMERIC,
    AsdComImprove NUMERIC,
    AsdAgrLand NUMERIC,
    AsdAgrImprove NUMERIC,
    AprLand NUMERIC,
    AprResLand NUMERIC,
    AprResImprove NUMERIC,
    AprComLand NUMERIC,
    AprComImprove NUMERIC,
    AprAgrLand NUMERIC,
    AprAgrImprove NUMERIC,
    AprExemptLand NUMERIC,
    AprExemptImprove NUMERIC,
    AsmtAppealNum INTEGER,
    AsmtAppealYear INTEGER,
    AsmtAppealType VARCHAR(50),
    CDALandUse1 VARCHAR(50),
    Zoning VARCHAR(50),
    NbrOfBldgsRes INTEGER,
    NbrOfBldgsCom INTEGER,
    Ward20 INTEGER,
    Precinct20 INTEGER,
    Nbrhd INTEGER,
    AsrNbrhd INTEGER
);
*/

export type UpdatedFilters = {
  landuse?: string[];
  cda?: string[];
  tif?: string[];
  ward?: string[];
  isCondominium?: boolean;
  isAbatedProperty?: boolean;
  isVacantLot?: boolean;
  isCommercial?: boolean;
  isResidential?: boolean;
  isMixedUse?: boolean;
  isExempt?: boolean;
  isTif?: string[];
  isAbated?: string[];
};

const applyFiltersToQuery = (query: any, filters: UpdatedFilters) => {
  if (filters.landuse) {
    query = query.in("asrlanduse1", filters.landuse);
  }
  if (filters.cda) {
    query = query.in("nbrhd", filters.cda);
  }
  if (filters.tif) {
    query = query.in("tifdist", filters.tif);
  }
  if (filters.ward) {
    query = query.in("ward20", filters.ward);
  }
  if (filters.isCondominium) {
    query = query.eq("condominium", filters.isCondominium);
  }
  if (filters.isVacantLot) {
    query = query.eq("vacantlot", filters.isVacantLot);
  }
  if (filters.isCommercial) {
    query = query.or("aprcomland.gt.0, aprcomimprove.gt.0");
    query = query.eq("aprresland", 0);
    query = query.eq("aprresimprove", 0);
  }
  if (filters.isResidential) {
    query = query.or("aprresland.gt.0, aprresimprove.gt.0");
    query = query.eq("aprcomland", 0);
    query = query.eq("aprcomimprove", 0);
  }
  if (filters.isExempt) {
    query = query.or("aprexemptland.gt.0, aprexemptimprove.gt.0");
  }
  if (filters.isMixedUse) {
    query = query.or("aprcomland.gt.0, aprcomimprove.gt.0");
    query = query.or("aprresland.gt.0, aprresimprove.gt.0");
    query = query.or("apragrland.gt.0, apragrimprove.gt.0");
  }
  if (filters.isTif ? filters.isTif[0] === "true" : false) {
    query = query.neq("tifdist", 0);
  }
  if (filters.isAbated ? filters.isAbated[0] === "true" : false) {
    query = query.eq("isabatedproperty", 1);
  }

  return query;
};

const ITEMS_PER_PAGE = 7;
export async function getFilteredData(
  filters: UpdatedFilters = {},
  selectString: string,
  currentPage?: number,
  sort?: string
) {
  const supabase = createClient();

  let query = supabase.from("parcels").select(selectString);
  let filteredQuery = applyFiltersToQuery(query, filters);

  if (currentPage) {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    const endingPage = offset + ITEMS_PER_PAGE - 1;
    const ascending = sort === "asc" ? true : false;

    filteredQuery = filteredQuery.range(offset, endingPage);
  }

  try {
    return await filteredQuery;
  } catch (error) {
    throw new Error("Failed to fetch data.");
  }
}

export const getPagesCount = async (filters: UpdatedFilters = {}) => {
  const supabase = createClient();
  let query = supabase
    .from("parcels")
    .select("asrparcelid", { count: "exact", head: true });
  let filteredQuery = applyFiltersToQuery(query, filters);
  try {
    const { count, error } = await filteredQuery;

    if (error) {
      throw new Error("Failed to fetch pages. Count is null.");
    }

    return Math.ceil(count / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch pages count.");
  }
};

export async function getCodes(code: string) {
  const possibleCodes = ["land_use_codes", "cda_codes", "tif_disticts"];

  if (!possibleCodes.includes(code)) {
    return Promise.reject("Invalid code");
  }

  const supabase = createClient();

  // Make the RPC call with the dynamic parameters
  const { data, error } = await supabase.from(code).select("*");

  if (error) {
    return Promise.reject(error);
  }

  return data;
}
