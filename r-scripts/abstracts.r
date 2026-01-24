source("utils.r")

paths <- list.files("C:/Users/dummerthz/Desktop/temps/abstracts", pattern = "[.]xls$", full.names = TRUE)
paths

abstracts = paths |> 
  set_names(basename) |> 
  map(readxl::read_excel) |> 
  list_rbind() %>% 
  get_nas_per_column(TRUE) %>%
  rename(
    date_filed = `DATE FILED`,
    daily_number = `DAILY NO`,
    type_of_conveyance = `TYPE OF CONVEYANCE`,
    date_of_deed = `DATE OF DEED`,
    grantor_name = FROM,
    grantee_name = TO,
    grantee_address = `TO ADDRESS`,
    consideration_amount = CONSIDERATION,
    city_block = `CITY BLOCK`,
    legal_description = `LEGAL DESCRIPTION`,
    title_company = `TITLE CO`
  )

names(abstracts)
