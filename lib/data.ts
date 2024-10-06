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
};

export async function getFilteredStats(filters: UpdatedFilters = {}) {
  const supabase = createClient();

  let query = supabase
    .from("parcels")
    .select("asdtotal.max(), asdtotal.avg(), asdtotal.sum(), asdtotal.count()");

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
  if (filters.isAbatedProperty) {
    query = query.eq("isabatedproperty", filters.isAbatedProperty);
  }
  if (filters.isVacantLot) {
    query = query.eq("vacantlot", filters.isVacantLot);
  }

  // Make the RPC call with the dynamic parameters
  const { data, error } = await query;

  if (error) {
    return Promise.reject(error);
  }

  return data;
}

export async function getFilteredData(
  filters: UpdatedFilters = {},
  selectString: string
) {
  const supabase = createClient();

  let query = supabase.from("parcels").select(selectString);

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
  if (filters.isAbatedProperty) {
    query = query.eq("isabatedproperty", filters.isAbatedProperty);
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
  if (filters.isMixedUse) {
    query = query.or("aprcomland.gt.0, aprcomimprove.gt.0");
    query = query.or("aprresland.gt.0, aprresimprove.gt.0");
  }

  // Make the RPC call with the dynamic parameters
  const { data, error } = await query;

  return { data, error };
}

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

// export async function getAssessmentStats(filters: Filters = {}) {
//   const supabase = createClient();

//   // Define the default parameters for the RPC call
//   const params: { [key: string]: any } = {
//     p_zip: null,
//     p_asrclasscode: null,
//     p_asrlanduse1: null,
//     p_isabatedproperty: null,
//     p_abatementtype: null,
//     p_abatementstartyear: null,
//     p_abatementendyear: null,
//     p_specbusdist: null,
//     p_tifdist: null,
//     p_zoning: null,
//     p_nbrhd: null,
//     p_asrnbrhd: null,
//   };

//   // Populate the parameters with provided filters
//   for (const [key, value] of Object.entries(filters)) {
//     const paramKey = `p_${key.toLowerCase()}`;
//     if (params.hasOwnProperty(paramKey)) {
//       params[paramKey] = value;
//     }
//   }

//   // Make the RPC call with the dynamic parameters
//   //   const { data, error } = await supabase.rpc("get_asdtotal_statistics", params);
//   const { data, error } = await supabase.rpc("get_asdtotal_statistics", params);

//   if (error) {
//     return Promise.reject(error);
//   }

//   return data;
// }
