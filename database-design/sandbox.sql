create table
    if not exists public.test_parcel_land_uses (
        id bigserial primary key,
        parcel_id bigint not null,
        land_use text not null,
        effective_date date not null,
        end_date date,
        constraint fk_parcel_land_use_parcel foreign key (parcel_id) references public.test_parcels (id) on delete cascade
    );

-- Indexes to speed up common lookups
create index if not exists idx_parcel_land_use_parcel on public.test_parcel_land_uses (parcel_id);

create index if not exists idx_parcel_land_use_landuse on public.test_parcel_land_uses (land_use);

create index if not exists idx_parcel_land_use_effective on public.test_parcel_land_uses (effective_date);

create index if not exists idx_parcel_land_use_end on public.test_parcel_land_uses (end_date);