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

type Filters = {
  zip?: string;
  asrclasscode?: number;
  asrlanduse1?: string;
  isabatedproperty?: boolean;
  abatementtype?: string;
  abatementstartyear?: number;
  abatementendyear?: number;
  specbusdist?: string;
  tifdist?: string;
  zoning?: string;
  nbrhd?: number;
  asrnbrhd?: number;
};

export async function getAssessmentStats(filters: Filters = {}) {
  const supabase = createClient();

  // Define the default parameters for the RPC call
  const params: { [key: string]: any } = {
    p_zip: null,
    p_asrclasscode: null,
    p_asrlanduse1: null,
    p_isabatedproperty: null,
    p_abatementtype: null,
    p_abatementstartyear: null,
    p_abatementendyear: null,
    p_specbusdist: null,
    p_tifdist: null,
    p_zoning: null,
    p_nbrhd: null,
    p_asrnbrhd: null,
  };

  // Populate the parameters with provided filters
  for (const [key, value] of Object.entries(filters)) {
    const paramKey = `p_${key.toLowerCase()}`;
    if (params.hasOwnProperty(paramKey)) {
      params[paramKey] = value;
    }
  }

  // Make the RPC call with the dynamic parameters
  const { data, error } = await supabase.rpc("get_asdtotal_statistics", params);

  if (error) {
    return Promise.reject(error);
  }

  return data;
}

export async function getDistinctValues(column: string) {
  const supabase = createClient();

  // Make the RPC call with the dynamic parameters
  const { data, error } = await supabase.rpc("get_distinct_values", {
    p_table_name: "parcels",
    p_column_name: column,
  });

  if (error) {
    return Promise.reject(error);
  }

  return data;
}
