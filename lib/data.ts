import { createClient } from "@/utils/supabase/server";
import { get } from "http";

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
  propertyClass?: string[];
  occupancy?: string[];
  nbhd?: string[];
  cda?: string[];
  tif?: string[];
  ward?: string[];
  specBusDist?: string[];
  isCondominium?: boolean;
  isAbatedProperty?: boolean;
  isVacantLot?: boolean;
  isCommercial?: boolean;
  isResidential?: boolean;
  isMixedUse?: boolean;
  isExempt?: boolean;
  isTif?: string[];
  isAbated?: string[];
  year?: string;
  query?: string;
};

const applyFiltersToQuery = (query: any, filters: UpdatedFilters) => {
  if (filters.occupancy) {
    query = query.in("occupancy", filters.occupancy);
  }
  if (filters.year) {
    query = query.in("year", filters.year);
  }
  if (filters.propertyClass && !filters.propertyClass.includes("all")) {
    query = query.in("property_class", filters.propertyClass);
  }
  if (filters.nbhd) {
    query = query.in("neighborhood_int", filters.nbhd);
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
  if (filters.specBusDist) {
    query = query.in("specbusdist", filters.specBusDist);
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

export type SalesFilters = {
  start_date?: string;
  end_date?: string;
  min_price?: number;
  max_price?: number;
};

const applySalesFiltersToQuery = (query: any, filters: SalesFilters) => {
  if (filters.start_date) {
    query = query.gte("date_of_sale", filters.start_date);
  }
  if (filters.end_date) {
    query = query.lte("date_of_sale", filters.end_date);
  }
  if (filters.min_price) {
    query = query.gte("net_selling_price", filters.min_price);
  }
  if (filters.max_price) {
    query = query.lte("net_selling_price", filters.max_price);
  }

  query.order("date_of_sale", { ascending: false });
  // query = query.limit(20);
  return query;
};

const applyAppealFiltersToQuery = (query: any, filters: any) => {
  if (filters.min_difference) {
    query = query.gte("total_difference", filters.min_difference);
  }
  if (filters.max_difference) {
    query = query.lte("total_difference", filters.max_difference);
  }
  if (filters.appraiser) {
    query = query.in("appraiser", filters.appraiser);
  }
  // query = query.limit(20);
  return query;
};

export const ITEMS_PER_PAGE = 9;
export async function getFilteredData({
  filters,
  currentPage,
  sortColumn,
  sortDirection,
  selectString,
  table,
  get_count,
  searchString,
  count,
  limit,
}: {
  filters: UpdatedFilters | SalesFilters | any;
  currentPage?: number;
  sortColumn?: string;
  sortDirection?: string;
  selectString?: string;
  table?: string;
  get_count?: boolean;
  count?: { count: "exact" | "planned" | "estimated"; head: boolean };
  searchString?: string;
  limit?: number;
}) {
  const limitNumber = limit || ITEMS_PER_PAGE;
  const supabase = createClient();

  let query = supabase
    .from(table || "parcels")
    .select(selectString, count ? count : {});
  let filteredQuery;

  switch (table) {
    case "get_sales_by_parcel_data":
      query = supabase.rpc(
        "get_sales_by_parcel_data",
        {
          occupancy_values: filters.occupancy || undefined,
        },
        get_count ? { count: "exact", head: true } : {}
      );
      // return await query;
      filteredQuery = applySalesFiltersToQuery(query, filters);
      break;
    case "search_site_addresses":
      query = supabase.rpc(
        "search_site_addresses",
        {
          search_text: searchString || undefined,
        },
        get_count ? { count: "exact", head: true } : {}
      );
      // return await query;
      filteredQuery = applyFiltersToQuery(query, filters);
      break;
    case "appeals":
      filteredQuery = applyAppealFiltersToQuery(query, filters);
      break;
    default:
      filteredQuery = applyFiltersToQuery(query, filters);
      break;
  }

  // let filteredQuery = applyFiltersToQuery(query, filters);
  const ascending = sortDirection === "asc" ? true : false;

  if (currentPage) {
    const offset = (currentPage - 1) * limitNumber;
    const endingPage = offset + limitNumber - 1;

    filteredQuery = filteredQuery.range(offset, endingPage);
  }

  if (sortColumn) {
    filteredQuery = filteredQuery.order(sortColumn, {
      ascending,
    });
  }

  try {
    return await filteredQuery;
  } catch (error) {
    throw new Error("Failed to fetch data.");
  }
}

export const getPagesCount = async (
  filters: UpdatedFilters = {},
  table?: string
) => {
  const supabase = createClient();
  let query = supabase
    .from(`${table || "parcels"}`)
    .select(`*`, { count: "exact", head: true });
  let filteredQuery = applyFiltersToQuery(query, filters);
  try {
    const { count, error } = await filteredQuery;

    if (error) {
      throw new Error("Failed to fetch pages. Count is null.");
    }

    return {
      totalPages: Math.ceil(count / ITEMS_PER_PAGE),
      count,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch pages count.");
  }
};

export async function getCodes(code: string) {
  const possibleCodes = [
    "land_use_codes",
    "cda_codes",
    "tif_district_codes",
    "spec_bus_dist_codes",
    "neighborhoods",
  ];

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

export async function getNeighborhoods({
  neighborhoods = [],
}: {
  neighborhoods?: number[];
}) {
  const supabase = createClient();

  let query = supabase.from("neighborhoods").select("*");

  if (neighborhoods.length > 0) {
    query = query.in("neighborhood", neighborhoods);
  }

  query = query.order("neighborhood");

  return await query;
}

export async function getAppraisers() {
  const supabase = createClient();
  return supabase.from("appraisers").select("*").order("appraiser");
}

export async function getAggregates() {
  const supabase = createClient();
  return supabase
    .from("parcel_year")
    .select(
      `parcel_number.count(),
    res_land_value:appraised_res_land.sum(),
    res_building_value:appraised_res_building.sum(),
    res_new_construction_value:appraised_res_new_construction.sum(),
    com_land_value:appraised_com_land.sum(),
    com_building_value:appraised_com_building.sum(),
    com_new_construction_value:appraised_com_new_construction.sum(),
    agr_land_value:appraised_agr_land.sum(),
    agr_building_value:appraised_agr_building.sum(),
    agr_new_construction_value:appraised_agr_new_construction.sum()`
    )
    .eq("year", 2025);
}
