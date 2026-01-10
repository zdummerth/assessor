source("utils.r")
source("supabase-report-transformations/lib.R")
source("supabase-report-transformations/data-sync/call_api.R")

# ============================================================================
# 1. LOAD RAW DATA
# ============================================================================

# VIN lookup data from text files
folder_path <- "//Hvm-asr-app-01/devnet/Support/PERSONAL PROPERTY/2026 PP VEHICLE IMPORT"

vin_df <- list.files(
  path = folder_path,
  pattern = "VIN.*\\.txt$",
  full.names = TRUE
) %>%
  map_dfr(
    ~ read_tsv(.x, col_names = FALSE, col_types = cols())
  ) %>% 
  distinct()

vin_lookup_2026 = vin_df %>% 
  mutate(
    description = paste(X4, X5, X6)
  ) %>% 
  select(
    vin = X1,
    model_year = X7,
    type = X3,
    description
  ) %>% 
  distinct()

# Guide 2024 data
guide24 = readxl::read_xlsx("C:/Users/dummerthz/Downloads/2024VS2025_Vehicle Table Comparison.xlsx", sheet = 2)
guide24 = guide24 %>% 
  rename_with(
    ~ paste0("value_", 2025:2006),
    .cols = `2025 Value`:`2006 Value`
  ) %>% 
  mutate(
    description = paste(make, model, body_type)
  ) %>% 
  select(
    description,
    type,
    make,
    model,
    trim = body_type,
    starts_with("value_"),
    default_value
  ) %>% 
  distinct()

# Guide 2025 data
guide25 = readxl::read_xlsx("C:/Users/dummerthz/Downloads/2024VS2025_Vehicle Table Comparison.xlsx", sheet = 1) 
guide25 = guide25 %>% 
  rename_with(
    ~ paste0("value_", 2025:2006),
    .cols = `2025 Value`:`2006 Value`
  ) %>% 
  mutate(
    description = paste(make, model, body_type)
  ) %>% 
  select(
    description,
    type,
    make,
    model,
    trim = body_type,
    starts_with("value_"),
    default_value
  ) %>% 
  distinct()

# Guide 2026 data
guide26 <- read_tsv(
  "//Hvm-asr-app-01/devnet/Support/PERSONAL PROPERTY/2026 PP VEHICLE IMPORT/2026Guide.txt",
  col_names = FALSE
) %>%
  rename_with(
    ~ paste0("value_", 2026:2007),
    .cols = X6:X25
  ) %>% 
  distinct() %>% 
  mutate(
    description = paste(X3, X4, X5)
  ) %>% 
  select(
    type = X2,
    description,
    make = X3,
    model = X4,
    trim = X5,
    default_value = X26,
    everything(),
    -X27
  ) %>% 
  distinct()

# ============================================================================
# 2. PROCESS & NORMALIZE GUIDE DATA
# ============================================================================

# Pivot all guides to long format with year and value columns
pivot_guide <- function(df, guide_year) {
  df %>%
    pivot_longer(
      cols = starts_with("value_"),
      names_to = "year",
      values_to = "value",
      names_prefix = "value_"
    ) %>%
    mutate(
      year = as.numeric(year),
      value = as.numeric(value)
    ) %>%
    filter(value > 0) %>%
    bind_rows(
      df %>%
        filter(as.numeric(default_value) > 0) %>%
        mutate(
          year = 9999,
          value = as.numeric(default_value)
        )
    ) %>%
    mutate(
      description = paste(make, model, trim)
    ) %>%
    select(type, make, model, trim, description, year, value) %>%
    distinct() %>%
    mutate(guide_year = guide_year)
}

guide24_pivoted <- pivot_guide(guide24, 2024)
guide25_pivoted <- pivot_guide(guide25, 2025)
guide26_pivoted <- pivot_guide(guide26, 2026)

# Combine all guides
all_guides <- bind_rows(
  guide24_pivoted,
  guide25_pivoted,
  guide26_pivoted
)

# Sanitize text for Postgres / JSON
all_guides <- all_guides %>%
  mutate(
    across(c(type, make, model, trim), ~ iconv(.x, from = "", to = "UTF-8", sub = "")),
    across(c(type, make, model, trim), ~ gsub("[[:cntrl:]]", " ", .x)),
    across(c(type, make, model, trim), ~ trimws(.x))
  )

# Create normalized guide tables
# Table 1: Unique vehicles (no guide year in this table)
guide_vehicles <- all_guides %>%
  select(type, make, model, trim, description) %>%
  distinct() %>%
  mutate(
    vehicle_id = map_chr(
      description,
      ~ digest::digest(.x, algo = "md5", serialize = FALSE)
    )
  ) %>%
  select(vehicle_id, type, make, model, trim, description)

# Table 2: Values by vehicle_id, guide_year, and model year
guide_vehicle_values <- all_guides %>%
  mutate(
    vehicle_id = map_chr(
      description,
      ~ digest::digest(.x, algo = "md5", serialize = FALSE)
    )
  ) %>%
  group_by(vehicle_id, guide_year, year) %>%
  summarise(
    value = min(value),
    .groups = "drop"
  ) %>% 
  distinct()

# ============================================================================
# 3. PROCESS ACCOUNT VEHICLES (FROM DEVNET REPORT)
# ============================================================================

account_vehicles = get_most_recent_file("G:/R-Projects/general/supabase-report-transformations/data/pp_multiple_vehicle_report") %>% 
  mutate(
    item_description = iconv(item_description, from = "", to = "UTF-8", sub = ""),
    item_description = trimws(item_description),
    model_year = as.numeric(str_sub(item_description, 1, 4)),
    description = trimws(str_sub(item_description, 5)),
    account_year = 2026,
    vehicle_id = map_chr(
      description,
      ~ digest::digest(.x, algo = "md5", serialize = FALSE)
    )
  ) %>% 
  select(
    account_number,
    vehicle_id,
    account_year,
    model_year,
    description,
    vin_number,
    current_value = value
  ) %>%
  # Join with guide values to get guide_value
  left_join(
    guide_vehicle_values, 
    join_by(vehicle_id, model_year == year, account_year == guide_year)
  ) %>% 
  rename(guide_value = value)

# ============================================================================
# 4. INSERT DATA TO DATABASE
# ============================================================================

# Insert guide tables
insert_batches(guide_vehicles %>% distinct(), 10000, "/guide_vehicles")
insert_batches(guide_vehicle_values %>% distinct(), 10000, "/guide_vehicle_values")

# Insert account vehicles
insert_batches(account_vehicles %>% distinct(), 10000, "/account_vehicles")



