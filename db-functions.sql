create or replace function public.get_field_reviews_with_parcel_details()
returns table (
  field_review_id        bigint,
  parcel_id              bigint,
  block                  integer,
  lot                    integer,
  ext                    integer,
  parcel_created_at      timestamp without time zone,
  parcel_retired_at      timestamp without time zone,

  review_created_at      timestamptz,
  review_due_date        date,
  site_visited_at        timestamp without time zone,
  review_type_id         bigint,
  review_type_slug       text,
  review_type_name       text,

  latest_status_hist_id  bigint,
  latest_status_set_at   timestamptz,
  latest_status_id       bigint,
  latest_status_name     text,

  address_place_id       text,
  address_line1          text,
  address_city           text,
  address_state          text,
  address_postcode       text,
  address_formatted      text,
  address_lat            double precision,
  address_lon            double precision,

  assessor_neighborhood_id  integer,
  assessor_neighborhood  integer,
  cda_neighborhood       text,
  cda_neighborhood_id    integer
)
language sql
stable
as $$
  select
    fr.id                         as field_review_id,
    p.id                          as parcel_id,
    p.block,
    p.lot,
    p.ext,
    p.created_at                  as parcel_created_at,
    p.retired_at                  as parcel_retired_at,

    fr.created_at                 as review_created_at,
    fr.due_date                   as review_due_date,
    fr.site_visited_at,
    fr.type_id                    as review_type_id,
    frt.slug                      as review_type_slug,
    frt.display_name              as review_type_name,

    ls.id                         as latest_status_hist_id,
    ls.created_at                 as latest_status_set_at,
    ls.status_id                  as latest_status_id,
    lss.name                      as latest_status_name,

    a.place_id                    as address_place_id,
    ga.address_line1              as address_line1,
    ga.city                       as address_city,
    ga.state                      as address_state,
    ga.postcode                   as address_postcode,
    ga.formatted                  as address_formatted,
    ga.lat                        as address_lat,
    ga.lon                        as address_lon,

    ns1.assessor_neighborhood_id,
    ns1.assessor_neighborhood,
    ns2.cda_neighborhood,
    ns2.cda_neighborhood_id

  from field_reviews fr
  join test_parcels p
    on p.id = fr.parcel_id

  left join field_review_types frt
    on frt.id = fr.type_id

  -- latest status per review
  left join lateral (
    select frsh.*
    from field_review_status_history frsh
    where frsh.review_id = fr.id
    order by frsh.created_at desc, frsh.id desc
    limit 1
  ) ls on true
  left join field_review_statuses lss
    on lss.id = ls.status_id

  -- latest address for parcel
  left join lateral (
    select tpa.*
    from test_parcel_addresses tpa
    where tpa.parcel_id = p.id
    order by
      coalesce(tpa.end_date, date '9999-12-31') desc,
      tpa.effective_date desc,
      tpa.place_id desc
    limit 1
  ) a on true

  left join test_geocoded_addresses ga
    on ga.place_id = a.place_id

  -- set 1 → assessor neighborhood (ID only)
  left join lateral (
    select
      tpn.neighborhood_id as assessor_neighborhood_id,
      n.neighborhood as assessor_neighborhood
    from test_parcel_neighborhoods tpn
    join neighborhoods n
      on n.id = tpn.neighborhood_id
    where tpn.parcel_id = p.id
      and n.set_id = 1
    order by
      coalesce(tpn.end_date, date '9999-12-31') desc,
      tpn.effective_date desc,
      tpn.id desc
    limit 1
  ) ns1 on true

  -- set 2 → cda neighborhood (NAME)
  left join lateral (
    select
      n.name as cda_neighborhood,
      n.id as cda_neighborhood_id
    from test_parcel_neighborhoods tpn
    join neighborhoods n
      on n.id = tpn.neighborhood_id
    where tpn.parcel_id = p.id
      and n.set_id = 2
    order by
      coalesce(tpn.end_date, date '9999-12-31') desc,
      tpn.effective_date desc,
      tpn.id desc
    limit 1
  ) ns2 on true;
$$;





select * from get_field_reviews_with_parcel_details() limit 10;
drop function get_field_reviews_with_parcel_details();

select * from test_parcel_neighborhoods tpn
join neighborhoods n on tpn.neighborhood_id = n.id
 where parcel_id = 260400;
select * from neighborhood_sets;

