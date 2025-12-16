create or replace function public.get_parcel_snapshots_asof(
  p_parcel_ids bigint[],
  p_asof_date  date
)
returns table (
  parcel_id bigint,
  snapshot  jsonb
)
language sql
stable
as $$
with base as (
  select p.*
  from public.parcels p
  where p.id = any(p_parcel_ids)
    and (p.retired_at is null or p.retired_at::date > p_asof_date)
),

-- parcel-level structure area summary (sum across structures linked as-of)
parcel_structure_area_summary as (
  select
    psl.parcel_id,
    coalesce(sum(ssv.area), 0)::bigint as total_area,
    coalesce(sum(case when ssv.finished is true then ssv.area else 0 end), 0)::bigint as finished_area
  from public.parcel_structure_links psl
  left join public.structure_section_versions ssv
    on ssv.structure_id = psl.structure_id
   and p_asof_date <@ ssv.valid
  where p_asof_date <@ psl.valid
    and psl.parcel_id = any(p_parcel_ids)
  group by psl.parcel_id
),

-- review ids relevant to each parcel (via review_targets + as-of structure/land links)
parcel_review_ids as (
  -- direct parcel targets
  select distinct
    b.id as parcel_id,
    rt.review_id
  from base b
  join public.review_targets rt
    on rt.target_type = 'parcel'
   and rt.target_id = b.id

  union

  -- structure targets (only if structure linked as-of)
  select distinct
    psl.parcel_id,
    rt.review_id
  from public.parcel_structure_links psl
  join public.review_targets rt
    on rt.target_type = 'structure'
   and rt.target_id = psl.structure_id
  where p_asof_date <@ psl.valid
    and psl.parcel_id = any(p_parcel_ids)

  union

  -- land targets (only if land linked as-of)
  select distinct
    pll.parcel_id,
    rt.review_id
  from public.parcel_land_links pll
  join public.review_targets rt
    on rt.target_type = 'land'
   and rt.target_id = pll.land_id
  where p_asof_date <@ pll.valid
    and pll.parcel_id = any(p_parcel_ids)
),

review_latest_status_asof as (
  select
    h.review_id,
    (array_agg(h.status_id order by h.created_at desc))[1] as status_id,
    (array_agg(h.created_at order by h.created_at desc))[1] as status_set_at
  from public.review_status_history h
  where h.created_at::date <= p_asof_date
  group by h.review_id
)

select
  p.id as parcel_id,

  jsonb_build_object(
    'as_of_date', p_asof_date,

    'parcel', jsonb_build_object(
      'id', p.id,
      'block', p.block,
      'lot', p.lot,
      'ext', p.ext,
      'created_at', p.created_at,
      'retired_at', p.retired_at
    ),

    -- -------------------------
    -- Addresses (primary + all as-of)
    -- -------------------------
    'primary_address',
      (
        select jsonb_build_object(
          'address', to_jsonb(a),
          'link', jsonb_build_object(
            'id', pal.id,
            'address_type', pal.address_type,
            'is_primary', pal.is_primary,
            'valid', pal.valid,
            'review_id', pal.review_id,
            'created_at', pal.created_at
          )
        )
        from public.parcel_address_links pal
        join public.addresses a on a.id = pal.address_id
        where pal.parcel_id = p.id
          and pal.address_type = 'site'
          and pal.is_primary = true
          and p_asof_date <@ pal.valid
        order by lower(pal.valid) desc, pal.id desc
        limit 1
      ),

    'addresses',
      (
        select coalesce(jsonb_agg(
          jsonb_build_object(
            'address', to_jsonb(a),
            'link', jsonb_build_object(
              'id', pal.id,
              'address_type', pal.address_type,
              'is_primary', pal.is_primary,
              'valid', pal.valid,
              'review_id', pal.review_id,
              'created_at', pal.created_at
            )
          )
          order by pal.address_type, lower(pal.valid), pal.id
        ), '[]'::jsonb)
        from public.parcel_address_links pal
        join public.addresses a on a.id = pal.address_id
        where pal.parcel_id = p.id
          and p_asof_date <@ pal.valid
      ),

    -- -------------------------
    -- Parcel tags / attributes (as-of)
    -- -------------------------
    'parcel_tags',
      (
        select coalesce(jsonb_agg(
          jsonb_build_object(
            'tag', to_jsonb(t),
            'valid', h.valid,
            'review_id', h.review_id
          )
          order by t.slug
        ), '[]'::jsonb)
        from public.parcel_tag_history h
        join public.parcel_tags t on t.id = h.tag_id
        where h.parcel_id = p.id
          and p_asof_date <@ h.valid
      ),

    'parcel_attributes',
      (
        select coalesce(jsonb_agg(
          jsonb_build_object(
            'definition', to_jsonb(d),
            'value', to_jsonb(v),
            'valid', h.valid,
            'review_id', h.review_id
          )
          order by d.slug
        ), '[]'::jsonb)
        from public.parcel_attribute_history h
        join public.parcel_attribute_definitions d on d.id = h.attribute_id
        join public.parcel_attribute_values v on v.id = h.attribute_value_id
        where h.parcel_id = p.id
          and p_asof_date <@ h.valid
      ),

    -- -------------------------
    -- Structures (as-of) INCLUDING AREAS FROM structure_section_versions
    -- -------------------------
    'structure_area_summary',
      (
        select jsonb_build_object(
          'total_area', coalesce(psas.total_area, 0),
          'finished_area', coalesce(psas.finished_area, 0)
        )
        from parcel_structure_area_summary psas
        where psas.parcel_id = p.id
      ),

    'structures',
      (
        select coalesce(jsonb_agg(
          jsonb_build_object(
            'structure_id', l.structure_id,
            'link', jsonb_build_object(
              'valid', l.valid,
              'review_id', l.review_id
            ),

            -- per-structure area summary as-of
            'areas',
              (
                select jsonb_build_object(
                  'total_area', coalesce(sum(ssv.area), 0),
                  'finished_area', coalesce(sum(case when ssv.finished is true then ssv.area else 0 end), 0)
                )
                from public.structure_section_versions ssv
                where ssv.structure_id = l.structure_id
                  and p_asof_date <@ ssv.valid
              ),

            -- sections as-of
            'section_versions',
              (
                select coalesce(jsonb_agg(
                  jsonb_build_object(
                    'id', ssv.id,
                    'section_type_id', ssv.section_type_id,
                    'valid', ssv.valid,
                    'area', ssv.area,
                    'finished', ssv.finished,
                    'construction_material_id', ssv.construction_material_id,
                    'review_id', ssv.review_id,
                    'created_at', ssv.created_at,
                    'created_by', ssv.created_by
                  )
                  order by lower(ssv.valid), ssv.id
                ), '[]'::jsonb)
                from public.structure_section_versions ssv
                where ssv.structure_id = l.structure_id
                  and p_asof_date <@ ssv.valid
              ),

            -- structure tags as-of
            'tags',
              (
                select coalesce(jsonb_agg(
                  jsonb_build_object(
                    'tag', to_jsonb(t),
                    'valid', h.valid,
                    'review_id', h.review_id
                  )
                  order by t.slug
                ), '[]'::jsonb)
                from public.structure_tag_history h
                join public.structure_tags t on t.id = h.tag_id
                where h.structure_id = l.structure_id
                  and p_asof_date <@ h.valid
              ),

            -- structure attributes as-of
            'attributes',
              (
                select coalesce(jsonb_agg(
                  jsonb_build_object(
                    'definition', to_jsonb(d),
                    'value', to_jsonb(v),
                    'valid', h.valid,
                    'review_id', h.review_id
                  )
                  order by d.slug
                ), '[]'::jsonb)
                from public.structure_attribute_history h
                join public.structure_attribute_definitions d on d.id = h.attribute_id
                join public.structure_attribute_values v on v.id = h.attribute_value_id
                where h.structure_id = l.structure_id
                  and p_asof_date <@ h.valid
              )
          )
          order by l.structure_id
        ), '[]'::jsonb)
        from public.parcel_structure_links l
        where l.parcel_id = p.id
          and p_asof_date <@ l.valid
      ),

    -- -------------------------
    -- Land (as-of)
    -- -------------------------
    'land',
      (
        select coalesce(jsonb_agg(
          jsonb_build_object(
            'land_id', l.land_id,
            'link', jsonb_build_object('valid', l.valid, 'review_id', l.review_id),

            'tags',
              (
                select coalesce(jsonb_agg(
                  jsonb_build_object(
                    'tag', to_jsonb(t),
                    'valid', h.valid,
                    'review_id', h.review_id
                  )
                  order by t.slug
                ), '[]'::jsonb)
                from public.land_tag_history h
                join public.land_tags t on t.id = h.tag_id
                where h.land_id = l.land_id
                  and p_asof_date <@ h.valid
              ),

            'attributes',
              (
                select coalesce(jsonb_agg(
                  jsonb_build_object(
                    'definition', to_jsonb(d),
                    'value', to_jsonb(v),
                    'valid', h.valid,
                    'review_id', h.review_id
                  )
                  order by d.slug
                ), '[]'::jsonb)
                from public.land_attribute_history h
                join public.land_attribute_definitions d on d.id = h.attribute_id
                join public.land_attribute_values v on v.id = h.attribute_value_id
                where h.land_id = l.land_id
                  and p_asof_date <@ h.valid
              )
          )
          order by l.land_id
        ), '[]'::jsonb)
        from public.parcel_land_links l
        where l.parcel_id = p.id
          and p_asof_date <@ l.valid
      ),

    -- -------------------------
    -- Sales (as-of via sale_versions)
    -- -------------------------
    'sales',
      (
        select coalesce(jsonb_agg(
          jsonb_build_object(
            'sale', to_jsonb(s),
            'version',
              (
                select jsonb_build_object(
                  'id', sv.id,
                  'valid', sv.valid,
                  'date_of_sale', sv.date_of_sale,
                  'sale_price', sv.sale_price,
                  'sale_type', to_jsonb(st),
                  'review_id', sv.review_id,
                  'created_at', sv.created_at,
                  'created_by', sv.created_by
                )
                from public.sale_versions sv
                left join public.sale_types st on st.id = sv.sale_type_id
                where sv.sale_id = s.id
                  and p_asof_date <@ sv.valid
                order by lower(sv.valid) desc, sv.id desc
                limit 1
              )
          )
          order by ((
            select sv2.date_of_sale
            from public.sale_versions sv2
            where sv2.sale_id = s.id and p_asof_date <@ sv2.valid
            order by lower(sv2.valid) desc, sv2.id desc
            limit 1
          )) desc nulls last, s.id desc
        ), '[]'::jsonb)
        from public.sale_parcels sp
        join public.sales s on s.id = sp.sale_id
        where sp.parcel_id = p.id
      ),

    -- -------------------------
    -- Reviews (as-of): via review_targets + latest status at/before asof
    -- -------------------------
    'reviews',
      (
        select coalesce(jsonb_agg(
          jsonb_build_object(
            'review', to_jsonb(r),
            'latest_status',
              (
                select jsonb_build_object(
                  'status', to_jsonb(rs),
                  'set_at', ls.status_set_at
                )
                from review_latest_status_asof ls
                left join public.review_statuses rs on rs.id = ls.status_id
                where ls.review_id = r.id
                limit 1
              ),
            'targets',
              (
                select coalesce(jsonb_agg(
                  jsonb_build_object(
                    'id', rt.id,
                    'target_type', rt.target_type,
                    'target_id', rt.target_id,
                    'created_at', rt.created_at,
                    'created_by', rt.created_by
                  )
                  order by rt.target_type, rt.target_id
                ), '[]'::jsonb)
                from public.review_targets rt
                where rt.review_id = r.id
              )
          )
          order by r.id desc
        ), '[]'::jsonb)
        from parcel_review_ids pri
        join public.reviews r on r.id = pri.review_id
        where pri.parcel_id = p.id
          and r.created_at::date <= p_asof_date
      )

  ) as snapshot
from base p
order by p.id;
$$;


create or replace function public.search_parcel_snapshots_asof(
  p_asof_date date,
  p_filters   jsonb default '{}'::jsonb,
  p_sort_key  text  default 'block_lot',   -- block_lot | finished_area | total_area | last_sale_price | last_sale_date | review_status
  p_sort_dir  text  default 'asc',         -- asc | desc
  p_limit     int   default 50,
  p_cursor    jsonb default null
)
returns table (
  total_count bigint,
  parcel_id   bigint,
  snapshot    jsonb
)
language sql
stable
as $$
with
-- normalize/validate sort inputs (returns 1 row always)
params as (
  select
    p_asof_date as asof_date,

    case
      when lower(coalesce(p_sort_dir,'asc')) in ('asc','desc')
      then lower(p_sort_dir)
      else 'asc'
    end as dir,

    case
      when p_sort_key in ('block_lot','finished_area','total_area','last_sale_price','last_sale_date','review_status')
      then p_sort_key
      else 'block_lot'
    end as sort_key,

    greatest(coalesce(p_limit, 50), 0) as lim
),

filter_ids as (
  select
    case
      when (p_filters ? 'parcel_ids') and jsonb_typeof(p_filters->'parcel_ids') = 'array'
      then array_agg(x.value::bigint)
      else null::bigint[]
    end as parcel_ids
  from jsonb_array_elements_text(coalesce(p_filters->'parcel_ids','[]'::jsonb)) as x(value)
),

base as (
  select p.*, p.id as pid
  from public.parcels p
  cross join params prm
  cross join filter_ids f
  where (p.retired_at is null or p.retired_at::date > prm.asof_date)
    and (f.parcel_ids is null or p.id = any(f.parcel_ids))
),

parcel_structures as (
  select psl.parcel_id as pid, psl.structure_id
  from public.parcel_structure_links psl
  cross join params prm
  where prm.asof_date <@ psl.valid
),

structure_areas as (
  select
    ssv.structure_id,
    coalesce(sum(ssv.area),0)::bigint as total_area,
    coalesce(sum(case when ssv.finished is true then ssv.area else 0 end),0)::bigint as finished_area
  from public.structure_section_versions ssv
  cross join params prm
  where prm.asof_date <@ ssv.valid
  group by ssv.structure_id
),

parcel_areas as (
  select
    ps.pid,
    coalesce(sum(sa.total_area),0)::bigint    as total_area,
    coalesce(sum(sa.finished_area),0)::bigint as finished_area
  from parcel_structures ps
  left join structure_areas sa on sa.structure_id = ps.structure_id
  group by ps.pid
),

parcel_sales as (
  select
    sp.parcel_id as pid,
    sv.date_of_sale,
    sv.sale_price,
    st.slug as sale_type_slug
  from public.sale_parcels sp
  join public.sale_versions sv on sv.sale_id = sp.sale_id
  left join public.sale_types st on st.id = sv.sale_type_id
  cross join params prm
  where prm.asof_date <@ sv.valid
    and (sv.date_of_sale is null or sv.date_of_sale <= prm.asof_date)
),

last_sale as (
  select distinct on (ps.pid)
    ps.pid,
    ps.date_of_sale as last_sale_date,
    ps.sale_price   as last_sale_price
  from parcel_sales ps
  order by ps.pid, ps.date_of_sale desc nulls last
),

parcel_lands as (
  select pll.parcel_id as pid, pll.land_id
  from public.parcel_land_links pll
  cross join params prm
  where prm.asof_date <@ pll.valid
),

parcel_review_ids as (
  select distinct rt.review_id, b.pid
  from base b
  join public.review_targets rt
    on rt.target_type = 'parcel'
   and rt.target_id = b.pid

  union

  select distinct rt.review_id, ps.pid
  from parcel_structures ps
  join public.review_targets rt
    on rt.target_type = 'structure'
   and rt.target_id = ps.structure_id

  union

  select distinct rt.review_id, pl.pid
  from parcel_lands pl
  join public.review_targets rt
    on rt.target_type = 'land'
   and rt.target_id = pl.land_id
),

review_latest_status_asof as (
  select
    h.review_id,
    (array_agg(h.status_id order by h.created_at desc))[1] as status_id
  from public.review_status_history h
  cross join params prm
  where h.created_at::date <= prm.asof_date
  group by h.review_id
),

parcel_review_summary as (
  select
    pri.pid,
    count(*) filter (where r.created_at::date <= prm.asof_date) as review_count,
    (array_agg(rs.slug order by
      case rs.slug
        when 'draft' then 10
        when 'submitted' then 20
        when 'approved' then 30
        when 'rejected' then 40
        else 999
      end asc
    ))[1] as best_status_slug
  from parcel_review_ids pri
  join public.reviews r on r.id = pri.review_id
  cross join params prm
  left join review_latest_status_asof ls on ls.review_id = pri.review_id
  left join public.review_statuses rs on rs.id = ls.status_id
  where r.created_at::date <= prm.asof_date
  group by pri.pid
),

filtered as (
  select
    b.pid,
    b.block, b.lot, b.ext,
    coalesce(pa.total_area,0)::bigint as total_area,
    coalesce(pa.finished_area,0)::bigint as finished_area,
    ls.last_sale_date,
    ls.last_sale_price,
    coalesce(prs.review_count,0)::bigint as review_count,
    prs.best_status_slug
  from base b
  cross join params prm
  left join parcel_areas pa on pa.pid = b.pid
  left join last_sale ls on ls.pid = b.pid
  left join parcel_review_summary prs on prs.pid = b.pid
  where true

    and (
      (p_filters->'structure'->>'min_finished_area') is null
      or coalesce(pa.finished_area,0) >= (p_filters->'structure'->>'min_finished_area')::bigint
    )
    and (
      (p_filters->'structure'->>'max_finished_area') is null
      or coalesce(pa.finished_area,0) <= (p_filters->'structure'->>'max_finished_area')::bigint
    )
    and (
      (p_filters->'structure'->>'min_total_area') is null
      or coalesce(pa.total_area,0) >= (p_filters->'structure'->>'min_total_area')::bigint
    )
    and (
      (p_filters->'structure'->>'max_total_area') is null
      or coalesce(pa.total_area,0) <= (p_filters->'structure'->>'max_total_area')::bigint
    )

    and (
      (p_filters->'sale'->>'min_price') is null
      or ls.last_sale_price >= (p_filters->'sale'->>'min_price')::numeric
    )
    and (
      (p_filters->'sale'->>'max_price') is null
      or ls.last_sale_price <= (p_filters->'sale'->>'max_price')::numeric
    )

    and (
      coalesce(jsonb_array_length(p_filters->'sale'->'types_any'),0) = 0
      or exists (
        select 1
        from parcel_sales ps
        where ps.pid = b.pid
          and ps.sale_type_slug = any (
            array(select jsonb_array_elements_text(p_filters->'sale'->'types_any'))
          )
      )
    )

    and (
      coalesce(jsonb_array_length(p_filters->'reviews'->'status_any'),0) = 0
      or prs.best_status_slug = any (
        array(select jsonb_array_elements_text(p_filters->'reviews'->'status_any'))
      )
    )
),

sortable as (
  select
    f.*,
    (lpad(f.block::text, 10, '0') || '-' || lpad(f.lot::text, 10, '0') || '-' || lpad(f.ext::text, 4, '0')) as sort_text_block_lot,
    f.finished_area::numeric as sort_num_finished_area,
    f.total_area::numeric    as sort_num_total_area,
    f.last_sale_price        as sort_num_last_sale_price,
    f.last_sale_date         as sort_date_last_sale_date,
    (case f.best_status_slug
      when 'draft' then 10
      when 'submitted' then 20
      when 'approved' then 30
      when 'rejected' then 40
      else 999
    end)::int as sort_num_review_status
  from filtered f
),

cursor_filtered as (
  select s.*
  from sortable s
  cross join params prm
  where p_cursor is null
     or (
       prm.dir = 'asc' and (
         case prm.sort_key
           when 'block_lot' then (s.sort_text_block_lot, s.pid) >
             ((p_cursor->>'sort_text')::text, (p_cursor->>'parcel_id')::bigint)
           when 'finished_area' then (s.sort_num_finished_area, s.pid) >
             ((p_cursor->>'sort_num')::numeric, (p_cursor->>'parcel_id')::bigint)
           when 'total_area' then (s.sort_num_total_area, s.pid) >
             ((p_cursor->>'sort_num')::numeric, (p_cursor->>'parcel_id')::bigint)
           when 'last_sale_price' then (coalesce(s.sort_num_last_sale_price, -1), s.pid) >
             ((p_cursor->>'sort_num')::numeric, (p_cursor->>'parcel_id')::bigint)
           when 'last_sale_date' then (coalesce(s.sort_date_last_sale_date, date '1900-01-01'), s.pid) >
             ((p_cursor->>'sort_date')::date, (p_cursor->>'parcel_id')::bigint)
           when 'review_status' then (s.sort_num_review_status::numeric, s.pid) >
             ((p_cursor->>'sort_num')::numeric, (p_cursor->>'parcel_id')::bigint)
         end
       )
     )
     or (
       prm.dir = 'desc' and (
         case prm.sort_key
           when 'block_lot' then (s.sort_text_block_lot, s.pid) <
             ((p_cursor->>'sort_text')::text, (p_cursor->>'parcel_id')::bigint)
           when 'finished_area' then (s.sort_num_finished_area, s.pid) <
             ((p_cursor->>'sort_num')::numeric, (p_cursor->>'parcel_id')::bigint)
           when 'total_area' then (s.sort_num_total_area, s.pid) <
             ((p_cursor->>'sort_num')::numeric, (p_cursor->>'parcel_id')::bigint)
           when 'last_sale_price' then (coalesce(s.sort_num_last_sale_price, -1), s.pid) <
             ((p_cursor->>'sort_num')::numeric, (p_cursor->>'parcel_id')::bigint)
           when 'last_sale_date' then (coalesce(s.sort_date_last_sale_date, date '1900-01-01'), s.pid) <
             ((p_cursor->>'sort_date')::date, (p_cursor->>'parcel_id')::bigint)
           when 'review_status' then (s.sort_num_review_status::numeric, s.pid) <
             ((p_cursor->>'sort_num')::numeric, (p_cursor->>'parcel_id')::bigint)
         end
       )
     )
),

cnt as (
  select count(*)::bigint as cnt
  from cursor_filtered
),

page_ids as (
  select cf.pid
  from cursor_filtered cf
  cross join params prm
  order by
    case when prm.sort_key='block_lot' and prm.dir='asc' then cf.sort_text_block_lot end asc,
    case when prm.sort_key='block_lot' and prm.dir='desc' then cf.sort_text_block_lot end desc,

    case when prm.sort_key='finished_area' and prm.dir='asc' then cf.sort_num_finished_area end asc,
    case when prm.sort_key='finished_area' and prm.dir='desc' then cf.sort_num_finished_area end desc,

    case when prm.sort_key='total_area' and prm.dir='asc' then cf.sort_num_total_area end asc,
    case when prm.sort_key='total_area' and prm.dir='desc' then cf.sort_num_total_area end desc,

    case when prm.sort_key='last_sale_price' and prm.dir='asc' then cf.sort_num_last_sale_price end asc nulls last,
    case when prm.sort_key='last_sale_price' and prm.dir='desc' then cf.sort_num_last_sale_price end desc nulls last,

    case when prm.sort_key='last_sale_date' and prm.dir='asc' then cf.sort_date_last_sale_date end asc nulls last,
    case when prm.sort_key='last_sale_date' and prm.dir='desc' then cf.sort_date_last_sale_date end desc nulls last,

    case when prm.sort_key='review_status' and prm.dir='asc' then cf.sort_num_review_status end asc,
    case when prm.sort_key='review_status' and prm.dir='desc' then cf.sort_num_review_status end desc,

    case when prm.dir='asc' then cf.pid end asc,
    case when prm.dir='desc' then cf.pid end desc
  limit (select lim from params)
),

ids as (
  select array_agg(p.pid order by p.pid) as parcel_ids
  from page_ids p
),

snaps as (
  select s.parcel_id, s.snapshot
  from ids i
  join lateral public.get_parcel_snapshots_asof(i.parcel_ids, (select asof_date from params)) s on true
)

select
  (select cnt from cnt) as total_count,
  snaps.parcel_id,
  snaps.snapshot
from snaps
order by snaps.parcel_id;
$$;
