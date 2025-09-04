create table public.test_parcels (
  id bigint not null,
  block integer not null,
  lot integer not null,
  ext integer not null default 0,
  created_at timestamp without time zone null default '2020-01-01 00:00:00'::timestamp without time zone,
  retired_at timestamp without time zone null,
  constraint test_parcels_pkey primary key (id),
  constraint test_parcels_block_lot_ext_key unique (block, lot, ext)
) TABLESPACE pg_default;

create table public.test_sales (
  sale_id bigint not null,
  date_of_sale date null,
  sale_year integer null,
  net_selling_price integer null,
  year integer null,
  report_timestamp timestamp with time zone not null default now(),
  listing_links jsonb null,
  constraint test_sales_pkey primary key (sale_id),
  constraint test_sales_net_selling_price_check check ((net_selling_price >= 0)),
  constraint test_sales_sale_year_chk check (
    (
      (sale_year is null)
      or (date_of_sale is null)
      or (
        (sale_year)::numeric = EXTRACT(
          year
          from
            date_of_sale
        )
      )
    )
  )
) 

create table public.test_parcel_sales (
  parcel_id bigint not null,
  sale_id bigint not null,
  report_timestamp timestamp with time zone not null default now(),
  constraint test_parcel_sales_pkey primary key (sale_id, parcel_id),
  constraint test_parcel_sales_parcel_fk foreign KEY (parcel_id) references test_parcels (id) on delete RESTRICT,
  constraint test_parcel_sales_sale_fk foreign KEY (sale_id) references test_sales (sale_id) on delete CASCADE
) TABLESPACE pg_default;


create table public.test_sale_types (
  id serial not null,
  sale_type text not null,
  is_valid boolean not null default true,
  created_at timestamp with time zone not null default now(),
  retired_at timestamp with time zone null,
  constraint test_sale_types_pkey primary key (id)
) TABLESPACE pg_default;

create table public.test_sales_sale_types (
  sale_id bigint not null,
  sale_type_id integer not null,
  effective_date date not null default CURRENT_DATE,
  report_timestamp timestamp with time zone not null default now(),
  created_at timestamp with time zone null default now(),
  constraint test_sales_sale_types_pkey primary key (sale_id, sale_type_id, effective_date),
  constraint test_sales_sale_fk foreign KEY (sale_id) references test_sales (sale_id) on delete CASCADE,
  constraint test_sales_sale_type_fk foreign KEY (sale_type_id) references test_sale_types (id) on delete RESTRICT
) TABLESPACE pg_default;

create table public.test_structures (
  id bigint not null,
  year_built integer null,
  material text null,
  bedrooms integer null,
  rooms integer null,
  full_bathrooms integer null,
  half_bathrooms integer null,
  type text null,
  category text null,
  constraint test_structures_pkey primary key (id)
) TABLESPACE pg_default;

create table public.test_structure_sections (
  id serial not null,
  structure_id bigint not null,
  type text not null,
  floor_number real null,
  finished_area integer null default 0,
  unfinished_area integer null default 0,
  constraint test_structure_sections_pkey primary key (id),
  constraint test_structure_sections_structure_id_fkey foreign KEY (structure_id) references test_structures (id) on delete CASCADE,
  constraint test_structure_sections_type_check check (
    (
      type = any (
        array[
          'floor'::text,
          'attic'::text,
          'basement'::text,
          'crawl space'::text,
          'addition'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create table public.test_parcel_land_uses (
  id bigserial not null,
  parcel_id bigint not null,
  land_use text not null,
  effective_date date not null,
  end_date date null,
  constraint test_parcel_land_uses_pkey primary key (id),
  constraint fk_parcel_land_use_parcel foreign KEY (parcel_id) references test_parcels (id) on delete CASCADE
) TABLESPACE pg_default;

create table public.test_conditions (
  id serial not null,
  structure_id bigint not null,
  condition text not null,
  effective_date date not null,
  created_at timestamp with time zone not null default now(),
  constraint test_conditions_pkey primary key (id),
  constraint test_conditions_structure_id_fkey foreign KEY (structure_id) references test_structures (id) on delete CASCADE
) TABLESPACE pg_default;