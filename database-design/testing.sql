create table
  public.abatement_programs (
    id bigint not null,
    scale_type varchar(255),
    first_year integer not null,
    last_year integer not null,
    type varchar(255),
    notes text,
    created_at timestampz default now () not null,
    primary key (id)
  )
create table
  public.abatement_phases (
    id bigserial primary key,
    abatement_program_id bigint not null references public.abatement_programs (id),
    phase integer not null,
    first_year integer not null,
    last_year integer not null,
    agr_abated numeric not null,
    com_abated numeric not null,
    res_abated numeric not null,
    created_at timestamptz not null default now ()
  );

-- abatement_parcels
create table
  public.abatement_parcels (
    id bigserial primary key,
    parcel_id bigint not null references public.test_parcels (id),
    program_id bigint not null references public.abatement_programs (id),
    agr_base_assessed integer not null default 0,
    com_base_assessed integer not null default 0,
    res_base_assessed integer not null default 0,
    created_at timestamptz not null default now ()
  );