source("utils.r")
source("supabase-report-transformations/lib.R")
source("supabase-report-transformations/data-sync/call_api.R")


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

# 2️⃣ Pivot all guides to long format with year and value columns
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
    select(type, make, model, trim, year, value) %>%
    distinct() %>%
    mutate(guide_year = guide_year)
}

guide24_pivoted <- pivot_guide(guide24, 2024)
guide25_pivoted <- pivot_guide(guide25, 2025)
guide26_pivoted <- pivot_guide(guide26, 2026)

nas = guide25_pivoted %>% 
  filter(
    is.na(trim)
  )

# 3️⃣ Combine all guides
all_guides <- bind_rows(
  guide24_pivoted,
  guide25_pivoted,
  guide26_pivoted
)

# 4️⃣ Sanitize text for Postgres / JSON
all_guides <- all_guides %>%
  mutate(
    across(c(type, make, model, trim), ~ iconv(.x, from = "", to = "UTF-8", sub = "")), # remove invalid UTF-8
    across(c(type, make, model, trim), ~ gsub("[[:cntrl:]]", " ", .x)), # remove control chars
    across(c(type, make, model, trim), ~ trimws(.x))
  )

# 5️⃣ Create normalized tables
# Unique vehicles (no guide year in this table)
guide_vehicles <- all_guides %>%
  select(type, make, model, trim) %>%
  distinct() %>%
  mutate(
    vehicle_id = map_chr(
      paste(
        coalesce(type, ""), 
        coalesce(make, ""), 
        coalesce(model, ""), 
        coalesce(trim, ""),
        sep = "|"
      ),
      ~ digest::digest(.x, algo = "md5", serialize = FALSE)
    )
  ) %>%
  select(vehicle_id, type, make, model, trim)

# Values table with guide_year
guide_vehicle_values <- all_guides %>%
  mutate(
    vehicle_id = map_chr(
      paste(
        coalesce(type, ""), 
        coalesce(make, ""), 
        coalesce(model, ""), 
        coalesce(trim, ""),
        sep = "|"
      ),
      ~ digest::digest(.x, algo = "md5", serialize = FALSE)
    )
  ) %>%
  select(vehicle_id, guide_year, year, value) %>%
  distinct()

# Insert normalized tables
insert_batches(guide_vehicles %>% distinct(), 10000, "/guide_vehicles")
insert_batches(guide_vehicle_values %>% distinct(), 10000, "/guide_vehicle_values")




sv = "2HKRM4H74DH619293"
sv2 <- "1FTFW3LD0SFC50024"





