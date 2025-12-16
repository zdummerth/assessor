-- ============================================================
-- FULL UPDATED SCHEMA (Postgres + Supabase)
-- Updates included:
-- - Keep daterange validity windows everywhere
-- - created_by uuid DEFAULT auth.uid() on every table
-- - Tags + Attributes are per-entity (parcel/structure/land) AND use value lookup tables
-- - Structure section type is in a lookup table
-- - Structure section versions include section_type_id + construction_material_id
-- - Approval workflow uses *_proposed tables + publish_review()
-- ============================================================

CREATE EXTENSION IF NOT EXISTS btree_gist;

-- ============================================================
-- REVIEWS (workflow + approval)
-- ============================================================
CREATE TABLE public.review_types (
  id bigserial PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid()
);

CREATE TABLE public.review_statuses (
  id bigserial PRIMARY KEY,
  slug text NOT NULL UNIQUE,      -- 'draft','submitted','approved','rejected'
  name text NOT NULL,
  is_terminal boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid()
);

CREATE TABLE public.reviews (
  id bigserial PRIMARY KEY,
  type_id bigint NOT NULL REFERENCES public.review_types(id),
  summary text NULL,
  due_date date NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid()
);

CREATE TABLE public.review_status_history (
  id bigserial PRIMARY KEY,
  review_id bigint NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  status_id bigint NOT NULL REFERENCES public.review_statuses(id),
  note text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid()
);

CREATE INDEX ON public.review_status_history (review_id, created_at DESC);

CREATE TABLE public.review_notes (
  id bigserial PRIMARY KEY,
  review_id bigint NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  note text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid()
);

CREATE TABLE public.review_files (
  id bigserial PRIMARY KEY,
  review_id bigint NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  storage_bucket text NOT NULL,
  storage_path text NOT NULL,
  file_name text NOT NULL,
  content_type text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid()
);

-- Optional: JSON diffs for UI/audit
CREATE TABLE public.review_changes (
  id bigserial PRIMARY KEY,
  review_id bigint NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  entity_type text NOT NULL,
  entity_id bigint NOT NULL,
  diff jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid()
);

CREATE INDEX ON public.review_changes (review_id);
CREATE INDEX ON public.review_changes (entity_type, entity_id);

-- Current status helper view
CREATE VIEW public.review_current_status AS
SELECT DISTINCT ON (h.review_id)
  h.review_id,
  h.status_id,
  s.slug AS status_slug,
  h.created_at AS status_set_at,
  h.created_by AS status_set_by
FROM public.review_status_history h
JOIN public.review_statuses s ON s.id = h.status_id
ORDER BY h.review_id, h.created_at DESC;

-- ============================================================
-- CORE ENTITIES
-- ============================================================
-- CREATE TABLE public.neighborhoods (
--   id bigserial PRIMARY KEY,
--   code text NULL UNIQUE,
--   name text NOT NULL,
--   created_at timestamptz NOT NULL DEFAULT now(),
--   created_by uuid DEFAULT auth.uid()
-- );

CREATE TABLE public.parcels (
  id bigserial PRIMARY KEY,
  parcel_no text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  retired_at timestamptz NULL,
  created_by uuid DEFAULT auth.uid()
);

ALTER TABLE public.parcels
  ADD COLUMN IF NOT EXISTS block integer,
  ADD COLUMN IF NOT EXISTS lot  integer,
  ADD COLUMN IF NOT EXISTS ext  integer NOT NULL DEFAULT 0;

ALTER TABLE public.parcels
  ADD CONSTRAINT parcels_block_lot_ext_key UNIQUE (block, lot, ext);

CREATE TABLE public.structures (
  id bigserial PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid()
);

CREATE TABLE public.land_components (
  id bigserial PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid()
);

-- ============================================================
-- PEOPLE + OWNERSHIP HISTORY
-- ============================================================
CREATE TABLE public.people (
  id bigserial PRIMARY KEY,
  display_name text NOT NULL,
  kind text NOT NULL DEFAULT 'person' CHECK (kind IN ('person','company','trust','government')),
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid()
);

CREATE TABLE public.parcel_owner_links (
  id bigserial PRIMARY KEY,
  parcel_id bigint NOT NULL REFERENCES public.parcels(id) ON DELETE CASCADE,
  person_id bigint NOT NULL REFERENCES public.people(id),
  valid daterange NOT NULL,
  ownership_pct numeric(6,3) NULL CHECK (ownership_pct IS NULL OR (ownership_pct >= 0 AND ownership_pct <= 100)),
  role text NULL,
  review_id bigint NOT NULL REFERENCES public.reviews(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid(),
  UNIQUE (parcel_id, person_id, valid)
);

ALTER TABLE public.parcel_owner_links
  ADD CONSTRAINT parcel_owner_no_overlap
  EXCLUDE USING gist (parcel_id WITH =, person_id WITH =, valid WITH &&);

CREATE INDEX ON public.parcel_owner_links (parcel_id);
CREATE INDEX ON public.parcel_owner_links (person_id);

-- ============================================================
-- ADDRESSES + PARCEL ADDRESS HISTORY
-- ============================================================
CREATE TABLE public.addresses (
  id bigserial PRIMARY KEY,
  place_id text NULL,
  line1 text NOT NULL,
  line2 text NULL,
  city text NOT NULL,
  state text NOT NULL,
  postcode text NOT NULL,
  formatted text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid(),
  UNIQUE (line1, city, state, postcode)
);

ALTER TABLE public.addresses
  ALTER COLUMN place_id SET NOT NULL;

ALTER TABLE public.addresses
  ADD CONSTRAINT addresses_place_id_key UNIQUE (place_id);
  


CREATE TABLE public.parcel_address_links (
  id bigserial PRIMARY KEY,
  parcel_id bigint NOT NULL REFERENCES public.parcels(id) ON DELETE CASCADE,
  address_id bigint NOT NULL REFERENCES public.addresses(id),
  address_type text NOT NULL CHECK (address_type IN ('site','mailing','other')),
  valid daterange NOT NULL,
  review_id bigint NOT NULL REFERENCES public.reviews(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid(),
  UNIQUE (parcel_id, address_type, valid)
);

ALTER TABLE public.parcel_address_links
  ADD CONSTRAINT parcel_address_no_overlap
  EXCLUDE USING gist (parcel_id WITH =, address_type WITH =, valid WITH &&);

CREATE INDEX ON public.parcel_address_links (parcel_id);
CREATE INDEX ON public.parcel_address_links (address_id);


ALTER TABLE public.parcel_address_links
  ADD COLUMN is_primary boolean NOT NULL DEFAULT false;

-- Speed up "current primary" lookups
CREATE INDEX parcel_address_links_primary_active_idx
  ON public.parcel_address_links (parcel_id, address_type)
  WHERE is_primary;

-- Enforce: at most one primary per parcel + address_type (regardless of validity rows)
-- If you want “one primary among *active* rows only”, see trigger below instead.
CREATE UNIQUE INDEX parcel_address_links_one_primary_per_type
  ON public.parcel_address_links (parcel_id, address_type)
  WHERE is_primary;


CREATE OR REPLACE FUNCTION public.ensure_single_primary_parcel_address()
RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.is_primary THEN
    UPDATE public.parcel_address_links pal
    SET is_primary = false
    WHERE pal.parcel_id = NEW.parcel_id
      AND pal.address_type = NEW.address_type
      AND pal.id <> NEW.id
      AND pal.is_primary = true;
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_single_primary_parcel_address ON public.parcel_address_links;

CREATE TRIGGER trg_single_primary_parcel_address
BEFORE INSERT OR UPDATE OF is_primary
ON public.parcel_address_links
FOR EACH ROW
EXECUTE FUNCTION public.ensure_single_primary_parcel_address();


-- ============================================================
-- UPDATE public.addresses to include columns from test_geocoded_addresses
-- (keeps your existing id bigserial PK, and keeps place_id nullable/unique-ish)
-- ============================================================

-- 1) Add the new columns
ALTER TABLE public.addresses
  ADD COLUMN IF NOT EXISTS devnet_address text,
  ADD COLUMN IF NOT EXISTS sourcename text,
  ADD COLUMN IF NOT EXISTS attribution text,
  ADD COLUMN IF NOT EXISTS license text,
  ADD COLUMN IF NOT EXISTS attribution_url text,
  ADD COLUMN IF NOT EXISTS match_type text,
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS country_code text,
  ADD COLUMN IF NOT EXISTS district text,
  ADD COLUMN IF NOT EXISTS street text,
  ADD COLUMN IF NOT EXISTS housenumber text,
  ADD COLUMN IF NOT EXISTS iso3166_2 text,
  ADD COLUMN IF NOT EXISTS result_type text,
  ADD COLUMN IF NOT EXISTS address_line1 text,
  ADD COLUMN IF NOT EXISTS address_line2 text,
  ADD COLUMN IF NOT EXISTS plus_code text,
  ADD COLUMN IF NOT EXISTS plus_code_short text,
  ADD COLUMN IF NOT EXISTS lat double precision,
  ADD COLUMN IF NOT EXISTS lon double precision,
  ADD COLUMN IF NOT EXISTS timezone text,
  ADD COLUMN IF NOT EXISTS timezone_offset text,
  ADD COLUMN IF NOT EXISTS timezone_abbreviation text,
  ADD COLUMN IF NOT EXISTS geocode_id text,
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS county text,
  ADD COLUMN IF NOT EXISTS distance double precision,
  ADD COLUMN IF NOT EXISTS footway text,
  ADD COLUMN IF NOT EXISTS hamlet text,
  ADD COLUMN IF NOT EXISTS name text,
  ADD COLUMN IF NOT EXISTS old_name text,
  ADD COLUMN IF NOT EXISTS ref text,
  ADD COLUMN IF NOT EXISTS state_code text,
  ADD COLUMN IF NOT EXISTS suburb text,
  ADD COLUMN IF NOT EXISTS town text,
  ADD COLUMN IF NOT EXISTS village text;

-- 2) (Optional) Generated full-text column for address_line1 (like your test table)
-- If you prefer to index line1 instead, change address_line1 -> line1
ALTER TABLE public.addresses
  ADD COLUMN IF NOT EXISTS fts_address_line1 tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english'::regconfig, COALESCE(address_line1, ''::text))
  ) STORED;

-- 3) Indexes (place_id + search)
CREATE INDEX IF NOT EXISTS addresses_place_id_idx
  ON public.addresses (place_id);

CREATE INDEX IF NOT EXISTS addresses_fts_address_line1_gin
  ON public.addresses USING gin (fts_address_line1);

-- 4) (Recommended) Ensure place_id is unique when present (allows multiple NULLs)
CREATE UNIQUE INDEX IF NOT EXISTS addresses_place_id_unique_not_null
  ON public.addresses (place_id)
  WHERE place_id IS NOT NULL;


ALTER TABLE public.addresses
  DROP CONSTRAINT IF EXISTS addresses_line1_city_state_postcode_key;

CREATE INDEX IF NOT EXISTS addresses_line1_city_state_postcode_idx
  ON public.addresses (line1, city, state, postcode);


-- 5) (Optional) Keep your original uniqueness, but consider including line2 too
-- Your current table has UNIQUE(line1, city, state, postcode).
-- If you want to tighten it:
-- ALTER TABLE public.addresses DROP CONSTRAINT IF EXISTS addresses_line1_city_state_postcode_key;
-- ALTER TABLE public.addresses ADD CONSTRAINT addresses_addr_unique UNIQUE (line1, line2, city, state, postcode);



-- ============================================================
-- PARCEL ↔ STRUCTURE / LAND LINKS (history-aware)
-- ============================================================
CREATE TABLE public.parcel_structure_links (
  id bigserial PRIMARY KEY,
  parcel_id bigint NOT NULL REFERENCES public.parcels(id) ON DELETE CASCADE,
  structure_id bigint NOT NULL REFERENCES public.structures(id) ON DELETE CASCADE,
  valid daterange NOT NULL,
  review_id bigint NOT NULL REFERENCES public.reviews(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid(),
  UNIQUE (parcel_id, structure_id, valid)
);

ALTER TABLE public.parcel_structure_links
  ADD CONSTRAINT parcel_structure_no_overlap
  EXCLUDE USING gist (parcel_id WITH =, structure_id WITH =, valid WITH &&);

CREATE INDEX ON public.parcel_structure_links (parcel_id);
CREATE INDEX ON public.parcel_structure_links (structure_id);

CREATE TABLE public.parcel_land_links (
  id bigserial PRIMARY KEY,
  parcel_id bigint NOT NULL REFERENCES public.parcels(id) ON DELETE CASCADE,
  land_id bigint NOT NULL REFERENCES public.land_components(id) ON DELETE CASCADE,
  valid daterange NOT NULL,
  review_id bigint NOT NULL REFERENCES public.reviews(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid(),
  UNIQUE (parcel_id, land_id, valid)
);

ALTER TABLE public.parcel_land_links
  ADD CONSTRAINT parcel_land_no_overlap
  EXCLUDE USING gist (parcel_id WITH =, land_id WITH =, valid WITH &&);

CREATE INDEX ON public.parcel_land_links (parcel_id);
CREATE INDEX ON public.parcel_land_links (land_id);

-- ============================================================
-- STRUCTURE HISTORY (published)
-- ============================================================
CREATE TABLE public.structure_versions (
  id bigserial PRIMARY KEY,
  structure_id bigint NOT NULL REFERENCES public.structures(id) ON DELETE CASCADE,
  valid daterange NOT NULL,

  neighborhood_id bigint NULL REFERENCES public.neighborhoods(id),
  year_built int NULL,
  condition text NULL,
  construction text NULL,
  stories numeric(4,2) NULL,
  gla int NULL,
  quality text NULL,
  grade text NULL,

  review_id bigint NOT NULL REFERENCES public.reviews(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid()
);

ALTER TABLE public.structure_versions
  ADD CONSTRAINT structure_versions_no_overlap
  EXCLUDE USING gist (structure_id WITH =, valid WITH &&);

CREATE INDEX ON public.structure_versions (structure_id);
CREATE INDEX ON public.structure_versions USING gist (valid);

-- ============================================================
-- STRUCTURE SECTIONS (lookup + versions)
-- ============================================================
CREATE TABLE public.structure_section_types (
  id bigserial PRIMARY KEY,
  slug text NOT NULL UNIQUE,     -- 'floor','basement','attic','addition','garage', etc.
  name text NOT NULL,
  description text NULL,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid()
);

CREATE TABLE public.construction_materials (
  id bigserial PRIMARY KEY,
  slug text NOT NULL UNIQUE,     -- 'brick','frame','concrete_block', etc.
  name text NOT NULL,
  description text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid()
);

CREATE TABLE public.structure_section_versions (
  id bigserial PRIMARY KEY,
  structure_id bigint NOT NULL REFERENCES public.structures(id) ON DELETE CASCADE,
  section_type_id bigint NOT NULL REFERENCES public.structure_section_types(id),
  valid daterange NOT NULL,

  area int NULL,
  finished boolean NULL,
  construction_material_id bigint NULL REFERENCES public.construction_materials(id),

  review_id bigint NOT NULL REFERENCES public.reviews(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid()
);

ALTER TABLE public.structure_section_versions
  ADD CONSTRAINT structure_section_versions_no_overlap
  EXCLUDE USING gist (structure_id WITH =, section_type_id WITH =, valid WITH &&);

CREATE INDEX ON public.structure_section_versions (structure_id, section_type_id);
CREATE INDEX ON public.structure_section_versions USING gist (valid);

-- ============================================================
-- LAND HISTORY (published)
-- ============================================================
CREATE TABLE public.land_versions (
  id bigserial PRIMARY KEY,
  land_id bigint NOT NULL REFERENCES public.land_components(id) ON DELETE CASCADE,
  valid daterange NOT NULL,

  land_use_code text NULL,
  acres numeric(12,6) NULL,
  sf int NULL,
  depth numeric(10,2) NULL,
  frontage numeric(10,2) NULL,
  zoning text NULL,

  review_id bigint NOT NULL REFERENCES public.reviews(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid()
);

ALTER TABLE public.land_versions
  ADD CONSTRAINT land_versions_no_overlap
  EXCLUDE USING gist (land_id WITH =, valid WITH &&);

CREATE INDEX ON public.land_versions (land_id);
CREATE INDEX ON public.land_versions USING gist (valid);

-- ============================================================
-- SALES + PERMITS (and optional version edits)
-- ============================================================
CREATE TABLE public.sale_types (
  id bigserial PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid()
);

CREATE TABLE public.sales (
  id bigserial PRIMARY KEY,
  document_number text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid()
);

CREATE TABLE public.sale_versions (
  id bigserial PRIMARY KEY,
  sale_id bigint NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  valid daterange NOT NULL,
  sale_price numeric(14,2) NULL,
  deed_type text NULL,
  arms_length boolean NULL,
  review_id bigint NOT NULL REFERENCES public.reviews(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid()
);

ALTER TABLE public.sale_versions
  ADD CONSTRAINT sale_versions_no_overlap
  EXCLUDE USING gist (sale_id WITH =, valid WITH &&);

ALTER TABLE public.sale_versions
  ADD COLUMN IF NOT EXISTS date_of_sale date NULL,
  ADD COLUMN IF NOT EXISTS sale_type_id bigint NULL REFERENCES public.sale_types(id);

CREATE INDEX ON public.sale_versions (sale_id);
CREATE INDEX ON public.sale_versions USING gist (valid);

CREATE TABLE public.sale_parcels (
  sale_id bigint NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  parcel_id bigint NOT NULL REFERENCES public.parcels(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid(),
  PRIMARY KEY (sale_id, parcel_id)
);

CREATE INDEX ON public.sale_parcels (parcel_id);

CREATE TABLE public.permit_types (
  id bigserial PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid()
);

CREATE TABLE public.permits (
  id bigserial PRIMARY KEY,
  permit_number text NOT NULL,
  permit_type_id bigint NULL REFERENCES public.permit_types(id),
  issued_date date NULL,
  closed_date date NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid()
);

CREATE TABLE public.permit_versions (
  id bigserial PRIMARY KEY,
  permit_id bigint NOT NULL REFERENCES public.permits(id) ON DELETE CASCADE,
  valid daterange NOT NULL,
  declared_value numeric(14,2) NULL,
  description text NULL,
  status text NULL,
  review_id bigint NOT NULL REFERENCES public.reviews(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid()
);

ALTER TABLE public.permit_versions
  ADD CONSTRAINT permit_versions_no_overlap
  EXCLUDE USING gist (permit_id WITH =, valid WITH &&);

CREATE INDEX ON public.permit_versions (permit_id);
CREATE INDEX ON public.permit_versions USING gist (valid);

CREATE TABLE public.permit_parcels (
  permit_id bigint NOT NULL REFERENCES public.permits(id) ON DELETE CASCADE,
  parcel_id bigint NOT NULL REFERENCES public.parcels(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid(),
  PRIMARY KEY (permit_id, parcel_id)
);

CREATE INDEX ON public.permit_parcels (parcel_id);

-- ============================================================
-- REVIEW LINKS (sales/permits) + OPTIONAL CUSTOM TARGETS
-- ============================================================
CREATE TABLE public.review_sales (
  review_id bigint NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  sale_id bigint NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid(),
  PRIMARY KEY (review_id, sale_id)
);

CREATE TABLE public.review_permits (
  review_id bigint NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  permit_id bigint NOT NULL REFERENCES public.permits(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid(),
  PRIMARY KEY (review_id, permit_id)
);

-- Custom review targets (optional)
CREATE TABLE public.review_targets (
  id bigserial PRIMARY KEY,
  review_id bigint NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  target_type text NOT NULL CHECK (target_type IN ('parcel','structure','land')),
  target_id bigint NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid()
);

CREATE INDEX ON public.review_targets (review_id);
CREATE INDEX ON public.review_targets (target_type, target_id);

-- ============================================================
-- TAGS (per entity) + VALUES + HISTORY
-- Pattern:
--   <entity>_tags          (category)
--   <entity>_tag_values    (allowed values)
--   <entity>_tag_history   (valid ranges; stores tag_id + tag_value_id)
-- ============================================================

-- ---- PARCEL TAGS
CREATE TABLE public.parcel_tags (
  id bigserial PRIMARY KEY,
  slug text NOT NULL UNIQUE,          -- 'occupancy'
  name text NOT NULL,
  description text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid()
);

CREATE TABLE public.parcel_tag_values (
  id bigserial PRIMARY KEY,
  tag_id bigint NOT NULL REFERENCES public.parcel_tags(id) ON DELETE CASCADE,
  slug text NOT NULL,                 -- 'vacant'
  name text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid(),
  UNIQUE (tag_id, slug),
  UNIQUE (tag_id, id)
);

CREATE TABLE public.parcel_tag_history (
  id bigserial PRIMARY KEY,
  parcel_id bigint NOT NULL REFERENCES public.parcels(id) ON DELETE CASCADE,
  tag_id bigint NOT NULL REFERENCES public.parcel_tags(id),
  tag_value_id bigint NOT NULL REFERENCES public.parcel_tag_values(id),
  valid daterange NOT NULL,
  review_id bigint NOT NULL REFERENCES public.reviews(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid(),
  UNIQUE (parcel_id, tag_id, valid),
  CONSTRAINT parcel_tag_value_matches_tag
    FOREIGN KEY (tag_id, tag_value_id)
    REFERENCES public.parcel_tag_values (tag_id, id)
);

ALTER TABLE public.parcel_tag_history
  ADD CONSTRAINT parcel_tag_no_overlap
  EXCLUDE USING gist (parcel_id WITH =, tag_id WITH =, valid WITH &&);

CREATE INDEX ON public.parcel_tag_history (parcel_id, tag_id);

-- ---- STRUCTURE TAGS
CREATE TABLE public.structure_tags (
  id bigserial PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid()
);

CREATE TABLE public.structure_tag_values (
  id bigserial PRIMARY KEY,
  tag_id bigint NOT NULL REFERENCES public.structure_tags(id) ON DELETE CASCADE,
  slug text NOT NULL,
  name text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid(),
  UNIQUE (tag_id, slug),
  UNIQUE (tag_id, id)
);

CREATE TABLE public.structure_tag_history (
  id bigserial PRIMARY KEY,
  structure_id bigint NOT NULL REFERENCES public.structures(id) ON DELETE CASCADE,
  tag_id bigint NOT NULL REFERENCES public.structure_tags(id),
  tag_value_id bigint NOT NULL REFERENCES public.structure_tag_values(id),
  valid daterange NOT NULL,
  review_id bigint NOT NULL REFERENCES public.reviews(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid(),
  UNIQUE (structure_id, tag_id, valid),
  CONSTRAINT structure_tag_value_matches_tag
    FOREIGN KEY (tag_id, tag_value_id)
    REFERENCES public.structure_tag_values (tag_id, id)
);

ALTER TABLE public.structure_tag_history
  ADD CONSTRAINT structure_tag_no_overlap
  EXCLUDE USING gist (structure_id WITH =, tag_id WITH =, valid WITH &&);

CREATE INDEX ON public.structure_tag_history (structure_id, tag_id);

-- ---- LAND TAGS
CREATE TABLE public.land_tags (
  id bigserial PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid()
);

CREATE TABLE public.land_tag_values (
  id bigserial PRIMARY KEY,
  tag_id bigint NOT NULL REFERENCES public.land_tags(id) ON DELETE CASCADE,
  slug text NOT NULL,
  name text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid(),
  UNIQUE (tag_id, slug),
  UNIQUE (tag_id, id)
);

CREATE TABLE public.land_tag_history (
  id bigserial PRIMARY KEY,
  land_id bigint NOT NULL REFERENCES public.land_components(id) ON DELETE CASCADE,
  tag_id bigint NOT NULL REFERENCES public.land_tags(id),
  tag_value_id bigint NOT NULL REFERENCES public.land_tag_values(id),
  valid daterange NOT NULL,
  review_id bigint NOT NULL REFERENCES public.reviews(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid(),
  UNIQUE (land_id, tag_id, valid),
  CONSTRAINT land_tag_value_matches_tag
    FOREIGN KEY (tag_id, tag_value_id)
    REFERENCES public.land_tag_values (tag_id, id)
);

ALTER TABLE public.land_tag_history
  ADD CONSTRAINT land_tag_no_overlap
  EXCLUDE USING gist (land_id WITH =, tag_id WITH =, valid WITH &&);

CREATE INDEX ON public.land_tag_history (land_id, tag_id);

-- ============================================================
-- ATTRIBUTES (per entity) + VALUES + HISTORY
-- Pattern:
--   <entity>_attribute_definitions
--   <entity>_attribute_values     (typed value options)
--   <entity>_attribute_history    (valid ranges; stores attribute_id + attribute_value_id)
-- ============================================================

-- Common check helper for value rows
-- (Postgres doesn't allow reusable CHECK macros; repeat below.)

-- ---- PARCEL ATTRIBUTES
CREATE TABLE public.parcel_attribute_definitions (
  id bigserial PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NULL,
  value_type text NOT NULL CHECK (value_type IN ('text','number','bool','date','json')),
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid()
);

CREATE TABLE public.parcel_attribute_values (
  id bigserial PRIMARY KEY,
  attribute_id bigint NOT NULL REFERENCES public.parcel_attribute_definitions(id) ON DELETE CASCADE,
  slug text NOT NULL,
  name text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,

  value_text text NULL,
  value_number numeric NULL,
  value_bool boolean NULL,
  value_date date NULL,
  value_json jsonb NULL,

  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid(),

  UNIQUE (attribute_id, slug),
  UNIQUE (attribute_id, id),

  CONSTRAINT parcel_attr_value_exactly_one CHECK (
    (value_text   IS NOT NULL)::int +
    (value_number IS NOT NULL)::int +
    (value_bool   IS NOT NULL)::int +
    (value_date   IS NOT NULL)::int +
    (value_json   IS NOT NULL)::int
    = 1
  )
);

CREATE TABLE public.parcel_attribute_history (
  id bigserial PRIMARY KEY,
  parcel_id bigint NOT NULL REFERENCES public.parcels(id) ON DELETE CASCADE,
  attribute_id bigint NOT NULL REFERENCES public.parcel_attribute_definitions(id),
  attribute_value_id bigint NOT NULL REFERENCES public.parcel_attribute_values(id),
  valid daterange NOT NULL,
  review_id bigint NOT NULL REFERENCES public.reviews(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid(),
  UNIQUE (parcel_id, attribute_id, valid),
  CONSTRAINT parcel_attr_value_matches_attr
    FOREIGN KEY (attribute_id, attribute_value_id)
    REFERENCES public.parcel_attribute_values (attribute_id, id)
);

ALTER TABLE public.parcel_attribute_history
  ADD CONSTRAINT parcel_attr_no_overlap
  EXCLUDE USING gist (parcel_id WITH =, attribute_id WITH =, valid WITH &&);

CREATE INDEX ON public.parcel_attribute_history (parcel_id, attribute_id);

-- ---- STRUCTURE ATTRIBUTES
CREATE TABLE public.structure_attribute_definitions (
  id bigserial PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NULL,
  value_type text NOT NULL CHECK (value_type IN ('text','number','bool','date','json')),
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid()
);

CREATE TABLE public.structure_attribute_values (
  id bigserial PRIMARY KEY,
  attribute_id bigint NOT NULL REFERENCES public.structure_attribute_definitions(id) ON DELETE CASCADE,
  slug text NOT NULL,
  name text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,

  value_text text NULL,
  value_number numeric NULL,
  value_bool boolean NULL,
  value_date date NULL,
  value_json jsonb NULL,

  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid(),

  UNIQUE (attribute_id, slug),
  UNIQUE (attribute_id, id),

  CONSTRAINT structure_attr_value_exactly_one CHECK (
    (value_text   IS NOT NULL)::int +
    (value_number IS NOT NULL)::int +
    (value_bool   IS NOT NULL)::int +
    (value_date   IS NOT NULL)::int +
    (value_json   IS NOT NULL)::int
    = 1
  )
);

CREATE TABLE public.structure_attribute_history (
  id bigserial PRIMARY KEY,
  structure_id bigint NOT NULL REFERENCES public.structures(id) ON DELETE CASCADE,
  attribute_id bigint NOT NULL REFERENCES public.structure_attribute_definitions(id),
  attribute_value_id bigint NOT NULL REFERENCES public.structure_attribute_values(id),
  valid daterange NOT NULL,
  review_id bigint NOT NULL REFERENCES public.reviews(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid(),
  UNIQUE (structure_id, attribute_id, valid),
  CONSTRAINT structure_attr_value_matches_attr
    FOREIGN KEY (attribute_id, attribute_value_id)
    REFERENCES public.structure_attribute_values (attribute_id, id)
);

ALTER TABLE public.structure_attribute_history
  ADD CONSTRAINT structure_attr_no_overlap
  EXCLUDE USING gist (structure_id WITH =, attribute_id WITH =, valid WITH &&);

CREATE INDEX ON public.structure_attribute_history (structure_id, attribute_id);

-- ---- LAND ATTRIBUTES
CREATE TABLE public.land_attribute_definitions (
  id bigserial PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NULL,
  value_type text NOT NULL CHECK (value_type IN ('text','number','bool','date','json')),
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid()
);

CREATE TABLE public.land_attribute_values (
  id bigserial PRIMARY KEY,
  attribute_id bigint NOT NULL REFERENCES public.land_attribute_definitions(id) ON DELETE CASCADE,
  slug text NOT NULL,
  name text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,

  value_text text NULL,
  value_number numeric NULL,
  value_bool boolean NULL,
  value_date date NULL,
  value_json jsonb NULL,

  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid(),

  UNIQUE (attribute_id, slug),
  UNIQUE (attribute_id, id),

  CONSTRAINT land_attr_value_exactly_one CHECK (
    (value_text   IS NOT NULL)::int +
    (value_number IS NOT NULL)::int +
    (value_bool   IS NOT NULL)::int +
    (value_date   IS NOT NULL)::int +
    (value_json   IS NOT NULL)::int
    = 1
  )
);

CREATE TABLE public.land_attribute_history (
  id bigserial PRIMARY KEY,
  land_id bigint NOT NULL REFERENCES public.land_components(id) ON DELETE CASCADE,
  attribute_id bigint NOT NULL REFERENCES public.land_attribute_definitions(id),
  attribute_value_id bigint NOT NULL REFERENCES public.land_attribute_values(id),
  valid daterange NOT NULL,
  review_id bigint NOT NULL REFERENCES public.reviews(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid(),
  UNIQUE (land_id, attribute_id, valid),
  CONSTRAINT land_attr_value_matches_attr
    FOREIGN KEY (attribute_id, attribute_value_id)
    REFERENCES public.land_attribute_values (attribute_id, id)
);

ALTER TABLE public.land_attribute_history
  ADD CONSTRAINT land_attr_no_overlap
  EXCLUDE USING gist (land_id WITH =, attribute_id WITH =, valid WITH &&);

CREATE INDEX ON public.land_attribute_history (land_id, attribute_id);

-- ============================================================
-- APPROVAL WORKFLOW: PROPOSED (draft) TABLES
-- ============================================================

-- ---- Proposed ownership
CREATE TABLE public.parcel_owner_links_proposed (
  id bigserial PRIMARY KEY,
  review_id bigint NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  parcel_id bigint NOT NULL REFERENCES public.parcels(id) ON DELETE CASCADE,
  person_id bigint NOT NULL REFERENCES public.people(id),
  valid daterange NOT NULL,
  ownership_pct numeric(6,3) NULL CHECK (ownership_pct IS NULL OR (ownership_pct >= 0 AND ownership_pct <= 100)),
  role text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid(),
  UNIQUE (review_id, parcel_id, person_id, valid)
);

ALTER TABLE public.parcel_owner_links_proposed
  ADD CONSTRAINT parcel_owner_prop_no_overlap
  EXCLUDE USING gist (review_id WITH =, parcel_id WITH =, person_id WITH =, valid WITH &&);

-- ---- Proposed parcel addresses
CREATE TABLE public.parcel_address_links_proposed (
  id bigserial PRIMARY KEY,
  review_id bigint NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  parcel_id bigint NOT NULL REFERENCES public.parcels(id) ON DELETE CASCADE,
  address_id bigint NOT NULL REFERENCES public.addresses(id),
  address_type text NOT NULL CHECK (address_type IN ('site','mailing','other')),
  valid daterange NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid(),
  UNIQUE (review_id, parcel_id, address_type, valid)
);

ALTER TABLE public.parcel_address_links_proposed
  ADD CONSTRAINT parcel_address_prop_no_overlap
  EXCLUDE USING gist (review_id WITH =, parcel_id WITH =, address_type WITH =, valid WITH &&);

-- ---- Proposed parcel-structure links
CREATE TABLE public.parcel_structure_links_proposed (
  id bigserial PRIMARY KEY,
  review_id bigint NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  parcel_id bigint NOT NULL REFERENCES public.parcels(id) ON DELETE CASCADE,
  structure_id bigint NOT NULL REFERENCES public.structures(id) ON DELETE CASCADE,
  valid daterange NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid(),
  UNIQUE (review_id, parcel_id, structure_id, valid)
);

ALTER TABLE public.parcel_structure_links_proposed
  ADD CONSTRAINT parcel_structure_prop_no_overlap
  EXCLUDE USING gist (review_id WITH =, parcel_id WITH =, structure_id WITH =, valid WITH &&);

-- ---- Proposed parcel-land links
CREATE TABLE public.parcel_land_links_proposed (
  id bigserial PRIMARY KEY,
  review_id bigint NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  parcel_id bigint NOT NULL REFERENCES public.parcels(id) ON DELETE CASCADE,
  land_id bigint NOT NULL REFERENCES public.land_components(id) ON DELETE CASCADE,
  valid daterange NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid(),
  UNIQUE (review_id, parcel_id, land_id, valid)
);

ALTER TABLE public.parcel_land_links_proposed
  ADD CONSTRAINT parcel_land_prop_no_overlap
  EXCLUDE USING gist (review_id WITH =, parcel_id WITH =, land_id WITH =, valid WITH &&);

-- ---- Proposed structure versions
CREATE TABLE public.structure_versions_proposed (
  id bigserial PRIMARY KEY,
  review_id bigint NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  structure_id bigint NOT NULL REFERENCES public.structures(id) ON DELETE CASCADE,
  valid daterange NOT NULL,
  neighborhood_id bigint NULL REFERENCES public.neighborhoods(id),
  year_built int NULL,
  condition text NULL,
  construction text NULL,
  stories numeric(4,2) NULL,
  gla int NULL,
  quality text NULL,
  grade text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid(),
  UNIQUE (review_id, structure_id, valid)
);

ALTER TABLE public.structure_versions_proposed
  ADD CONSTRAINT structure_versions_prop_no_overlap
  EXCLUDE USING gist (review_id WITH =, structure_id WITH =, valid WITH &&);

-- ---- Proposed structure section versions
CREATE TABLE public.structure_section_versions_proposed (
  id bigserial PRIMARY KEY,
  review_id bigint NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  structure_id bigint NOT NULL REFERENCES public.structures(id) ON DELETE CASCADE,
  section_type_id bigint NOT NULL REFERENCES public.structure_section_types(id),
  valid daterange NOT NULL,
  area int NULL,
  finished boolean NULL,
  construction_material_id bigint NULL REFERENCES public.construction_materials(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid(),
  UNIQUE (review_id, structure_id, section_type_id, valid)
);

ALTER TABLE public.structure_section_versions_proposed
  ADD CONSTRAINT structure_section_versions_prop_no_overlap
  EXCLUDE USING gist (review_id WITH =, structure_id WITH =, section_type_id WITH =, valid WITH &&);

-- ---- Proposed land versions
CREATE TABLE public.land_versions_proposed (
  id bigserial PRIMARY KEY,
  review_id bigint NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  land_id bigint NOT NULL REFERENCES public.land_components(id) ON DELETE CASCADE,
  valid daterange NOT NULL,
  land_use_code text NULL,
  acres numeric(12,6) NULL,
  sf int NULL,
  depth numeric(10,2) NULL,
  frontage numeric(10,2) NULL,
  zoning text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid(),
  UNIQUE (review_id, land_id, valid)
);

ALTER TABLE public.land_versions_proposed
  ADD CONSTRAINT land_versions_prop_no_overlap
  EXCLUDE USING gist (review_id WITH =, land_id WITH =, valid WITH &&);

-- ---- Proposed sale versions (optional)
CREATE TABLE public.sale_versions_proposed (
  id bigserial PRIMARY KEY,
  review_id bigint NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  sale_id bigint NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  valid daterange NOT NULL,
  sale_price numeric(14,2) NULL,
  deed_type text NULL,
  arms_length boolean NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid(),
  UNIQUE (review_id, sale_id, valid)
);

ALTER TABLE public.sale_versions_proposed
  ADD CONSTRAINT sale_versions_prop_no_overlap
  EXCLUDE USING gist (review_id WITH =, sale_id WITH =, valid WITH &&);

ALTER TABLE public.sale_versions_proposed
  ADD COLUMN IF NOT EXISTS date_of_sale date NULL,
  ADD COLUMN IF NOT EXISTS sale_type_id bigint NULL REFERENCES public.sale_types(id);

-- ---- Proposed permit versions (optional)
CREATE TABLE public.permit_versions_proposed (
  id bigserial PRIMARY KEY,
  review_id bigint NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  permit_id bigint NOT NULL REFERENCES public.permits(id) ON DELETE CASCADE,
  valid daterange NOT NULL,
  declared_value numeric(14,2) NULL,
  description text NULL,
  status text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid(),
  UNIQUE (review_id, permit_id, valid)
);

ALTER TABLE public.permit_versions_proposed
  ADD CONSTRAINT permit_versions_prop_no_overlap
  EXCLUDE USING gist (review_id WITH =, permit_id WITH =, valid WITH &&);

-- ---- Proposed TAG history (value-based)
CREATE TABLE public.parcel_tag_history_proposed (
  id bigserial PRIMARY KEY,
  review_id bigint NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  parcel_id bigint NOT NULL REFERENCES public.parcels(id) ON DELETE CASCADE,
  tag_id bigint NOT NULL REFERENCES public.parcel_tags(id),
  tag_value_id bigint NOT NULL REFERENCES public.parcel_tag_values(id),
  valid daterange NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid(),
  UNIQUE (review_id, parcel_id, tag_id, valid),
  CONSTRAINT parcel_tag_prop_value_matches_tag
    FOREIGN KEY (tag_id, tag_value_id)
    REFERENCES public.parcel_tag_values (tag_id, id)
);

CREATE TABLE public.structure_tag_history_proposed (
  id bigserial PRIMARY KEY,
  review_id bigint NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  structure_id bigint NOT NULL REFERENCES public.structures(id) ON DELETE CASCADE,
  tag_id bigint NOT NULL REFERENCES public.structure_tags(id),
  tag_value_id bigint NOT NULL REFERENCES public.structure_tag_values(id),
  valid daterange NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid(),
  UNIQUE (review_id, structure_id, tag_id, valid),
  CONSTRAINT structure_tag_prop_value_matches_tag
    FOREIGN KEY (tag_id, tag_value_id)
    REFERENCES public.structure_tag_values (tag_id, id)
);

CREATE TABLE public.land_tag_history_proposed (
  id bigserial PRIMARY KEY,
  review_id bigint NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  land_id bigint NOT NULL REFERENCES public.land_components(id) ON DELETE CASCADE,
  tag_id bigint NOT NULL REFERENCES public.land_tags(id),
  tag_value_id bigint NOT NULL REFERENCES public.land_tag_values(id),
  valid daterange NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid(),
  UNIQUE (review_id, land_id, tag_id, valid),
  CONSTRAINT land_tag_prop_value_matches_tag
    FOREIGN KEY (tag_id, tag_value_id)
    REFERENCES public.land_tag_values (tag_id, id)
);

-- ---- Proposed ATTRIBUTE history (value-based)
CREATE TABLE public.parcel_attribute_history_proposed (
  id bigserial PRIMARY KEY,
  review_id bigint NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  parcel_id bigint NOT NULL REFERENCES public.parcels(id) ON DELETE CASCADE,
  attribute_id bigint NOT NULL REFERENCES public.parcel_attribute_definitions(id),
  attribute_value_id bigint NOT NULL REFERENCES public.parcel_attribute_values(id),
  valid daterange NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid(),
  UNIQUE (review_id, parcel_id, attribute_id, valid),
  CONSTRAINT parcel_attr_prop_value_matches_attr
    FOREIGN KEY (attribute_id, attribute_value_id)
    REFERENCES public.parcel_attribute_values (attribute_id, id)
);

CREATE TABLE public.structure_attribute_history_proposed (
  id bigserial PRIMARY KEY,
  review_id bigint NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  structure_id bigint NOT NULL REFERENCES public.structures(id) ON DELETE CASCADE,
  attribute_id bigint NOT NULL REFERENCES public.structure_attribute_definitions(id),
  attribute_value_id bigint NOT NULL REFERENCES public.structure_attribute_values(id),
  valid daterange NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid(),
  UNIQUE (review_id, structure_id, attribute_id, valid),
  CONSTRAINT structure_attr_prop_value_matches_attr
    FOREIGN KEY (attribute_id, attribute_value_id)
    REFERENCES public.structure_attribute_values (attribute_id, id)
);

CREATE TABLE public.land_attribute_history_proposed (
  id bigserial PRIMARY KEY,
  review_id bigint NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  land_id bigint NOT NULL REFERENCES public.land_components(id) ON DELETE CASCADE,
  attribute_id bigint NOT NULL REFERENCES public.land_attribute_definitions(id),
  attribute_value_id bigint NOT NULL REFERENCES public.land_attribute_values(id),
  valid daterange NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid(),
  UNIQUE (review_id, land_id, attribute_id, valid),
  CONSTRAINT land_attr_prop_value_matches_attr
    FOREIGN KEY (attribute_id, attribute_value_id)
    REFERENCES public.land_attribute_values (attribute_id, id)
);

-- ============================================================
-- GUARDRAIL: lock proposed edits once approved/rejected
-- ============================================================
CREATE OR REPLACE FUNCTION public.enforce_review_editable(p_review_id bigint)
RETURNS void
LANGUAGE plpgsql AS $$
DECLARE st text;
BEGIN
  SELECT status_slug INTO st
  FROM public.review_current_status
  WHERE review_id = p_review_id;

  IF st IS NULL THEN
    RAISE EXCEPTION 'Review % has no status', p_review_id;
  END IF;

  IF st IN ('approved','rejected') THEN
    RAISE EXCEPTION 'Review % is %, draft data is locked', p_review_id, st;
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.trg_proposed_edit_guard()
RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  PERFORM public.enforce_review_editable(COALESCE(NEW.review_id, OLD.review_id));
  RETURN COALESCE(NEW, OLD);
END $$;

DO $$
DECLARE t regclass;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'public.parcel_owner_links_proposed'::regclass,
    'public.parcel_address_links_proposed'::regclass,
    'public.parcel_structure_links_proposed'::regclass,
    'public.parcel_land_links_proposed'::regclass,
    'public.structure_versions_proposed'::regclass,
    'public.structure_section_versions_proposed'::regclass,
    'public.land_versions_proposed'::regclass,
    'public.sale_versions_proposed'::regclass,
    'public.permit_versions_proposed'::regclass,
    'public.parcel_tag_history_proposed'::regclass,
    'public.structure_tag_history_proposed'::regclass,
    'public.land_tag_history_proposed'::regclass,
    'public.parcel_attribute_history_proposed'::regclass,
    'public.structure_attribute_history_proposed'::regclass,
    'public.land_attribute_history_proposed'::regclass
  ]
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS proposed_edit_guard ON %s;', t);
    EXECUTE format($f$
      CREATE TRIGGER proposed_edit_guard
      BEFORE INSERT OR UPDATE OR DELETE ON %s
      FOR EACH ROW EXECUTE FUNCTION public.trg_proposed_edit_guard();
    $f$, t);
  END LOOP;
END $$;

-- ============================================================
-- PUBLISH: copy proposed -> published when approved
-- (append-only publisher; relies on overlap constraints to protect integrity)
-- ============================================================
CREATE OR REPLACE FUNCTION public.publish_review(p_review_id bigint)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE st text;
BEGIN
  SELECT status_slug INTO st
  FROM public.review_current_status
  WHERE review_id = p_review_id;

  IF st <> 'approved' THEN
    RAISE EXCEPTION 'Cannot publish review %, status is %', p_review_id, st;
  END IF;

  -- Ownership
  INSERT INTO public.parcel_owner_links (parcel_id, person_id, valid, ownership_pct, role, review_id, created_at, created_by)
  SELECT parcel_id, person_id, valid, ownership_pct, role, review_id, created_at, created_by
  FROM public.parcel_owner_links_proposed
  WHERE review_id = p_review_id;

  -- Addresses
  INSERT INTO public.parcel_address_links (parcel_id, address_id, address_type, valid, review_id, created_at, created_by)
  SELECT parcel_id, address_id, address_type, valid, review_id, created_at, created_by
  FROM public.parcel_address_links_proposed
  WHERE review_id = p_review_id;

  -- Parcel links
  INSERT INTO public.parcel_structure_links (parcel_id, structure_id, valid, review_id, created_at, created_by)
  SELECT parcel_id, structure_id, valid, review_id, created_at, created_by
  FROM public.parcel_structure_links_proposed
  WHERE review_id = p_review_id;

  INSERT INTO public.parcel_land_links (parcel_id, land_id, valid, review_id, created_at, created_by)
  SELECT parcel_id, land_id, valid, review_id, created_at, created_by
  FROM public.parcel_land_links_proposed
  WHERE review_id = p_review_id;

  -- Structure versions
  INSERT INTO public.structure_versions
    (structure_id, valid, neighborhood_id, year_built, condition, construction, stories, gla, quality, grade,
     review_id, created_at, created_by)
  SELECT
    structure_id, valid, neighborhood_id, year_built, condition, construction, stories, gla, quality, grade,
    review_id, created_at, created_by
  FROM public.structure_versions_proposed
  WHERE review_id = p_review_id;

  -- Structure section versions
  INSERT INTO public.structure_section_versions
    (structure_id, section_type_id, valid, area, finished, construction_material_id,
     review_id, created_at, created_by)
  SELECT
    structure_id, section_type_id, valid, area, finished, construction_material_id,
    review_id, created_at, created_by
  FROM public.structure_section_versions_proposed
  WHERE review_id = p_review_id;

  -- Land versions
  INSERT INTO public.land_versions
    (land_id, valid, land_use_code, acres, sf, depth, frontage, zoning,
     review_id, created_at, created_by)
  SELECT
    land_id, valid, land_use_code, acres, sf, depth, frontage, zoning,
    review_id, created_at, created_by
  FROM public.land_versions_proposed
  WHERE review_id = p_review_id;

  -- Sale/Permit version edits (optional)
  INSERT INTO public.sale_versions (sale_id, valid, sale_price, deed_type, arms_length, review_id, created_at, created_by)
  SELECT sale_id, valid, sale_price, deed_type, arms_length, review_id, created_at, created_by
  FROM public.sale_versions_proposed
  WHERE review_id = p_review_id;

  INSERT INTO public.permit_versions (permit_id, valid, declared_value, description, status, review_id, created_at, created_by)
  SELECT permit_id, valid, declared_value, description, status, review_id, created_at, created_by
  FROM public.permit_versions_proposed
  WHERE review_id = p_review_id;

  -- Tags (value-based)
  INSERT INTO public.parcel_tag_history (parcel_id, tag_id, tag_value_id, valid, review_id, created_at, created_by)
  SELECT parcel_id, tag_id, tag_value_id, valid, review_id, created_at, created_by
  FROM public.parcel_tag_history_proposed
  WHERE review_id = p_review_id;

  INSERT INTO public.structure_tag_history (structure_id, tag_id, tag_value_id, valid, review_id, created_at, created_by)
  SELECT structure_id, tag_id, tag_value_id, valid, review_id, created_at, created_by
  FROM public.structure_tag_history_proposed
  WHERE review_id = p_review_id;

  INSERT INTO public.land_tag_history (land_id, tag_id, tag_value_id, valid, review_id, created_at, created_by)
  SELECT land_id, tag_id, tag_value_id, valid, review_id, created_at, created_by
  FROM public.land_tag_history_proposed
  WHERE review_id = p_review_id;

  -- Attributes (value-based)
  INSERT INTO public.parcel_attribute_history (parcel_id, attribute_id, attribute_value_id, valid, review_id, created_at, created_by)
  SELECT parcel_id, attribute_id, attribute_value_id, valid, review_id, created_at, created_by
  FROM public.parcel_attribute_history_proposed
  WHERE review_id = p_review_id;

  INSERT INTO public.structure_attribute_history (structure_id, attribute_id, attribute_value_id, valid, review_id, created_at, created_by)
  SELECT structure_id, attribute_id, attribute_value_id, valid, review_id, created_at, created_by
  FROM public.structure_attribute_history_proposed
  WHERE review_id = p_review_id;

  INSERT INTO public.land_attribute_history (land_id, attribute_id, attribute_value_id, valid, review_id, created_at, created_by)
  SELECT land_id, attribute_id, attribute_value_id, valid, review_id, created_at, created_by
  FROM public.land_attribute_history_proposed
  WHERE review_id = p_review_id;

END $$;

-- ============================================================
-- NOTE: Deriving structures/land in a sale/permit (no sale_parcel_* tables)
-- ============================================================
-- Sale structures (sale.date_of_sale is anchor):
-- SELECT DISTINCT psl.structure_id
-- FROM public.sales s
-- JOIN public.sale_parcels sp ON sp.sale_id = s.id
-- JOIN public.parcel_structure_links psl ON psl.parcel_id = sp.parcel_id
-- WHERE s.id = $1 AND s.date_of_sale <@ psl.valid;

-- Permit structures (permits.issued_date is anchor):
-- SELECT DISTINCT psl.structure_id
-- FROM public.permits p
-- JOIN public.permit_parcels pp ON pp.permit_id = p.id
-- JOIN public.parcel_structure_links psl ON psl.parcel_id = pp.parcel_id
-- WHERE p.id = $1 AND p.issued_date <@ psl.valid;
