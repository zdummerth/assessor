-- ============================================================
-- SEED-V2.SQL: Large-scale test data generation
-- Creates 100,000+ parcels with buildings, land, sales, and reviews
-- ============================================================

-- ============================================================
-- SEED DEFAULT STATUSES AND EMPLOYEES
-- ============================================================

-- Insert default review statuses for all review types
INSERT INTO public.review_statuses_v2 (review_kind, slug, name, is_terminal, needs_approval, sort_order) 
VALUES 
-- Sale review statuses
('sale_review', 'draft', 'Draft', false, false, 1),
('sale_review', 'under-review', 'Under Review', false, false, 2),
('sale_review', 'needs-approval', 'Needs Approval', false, true, 3),
('sale_review', 'approved', 'Approved - Valid Sale', true, false, 4),
('sale_review', 'rejected', 'Rejected - Invalid Sale', true, false, 5),

-- Permit review statuses  
('permit_review', 'received', 'Received', false, false, 1),
('permit_review', 'under-review', 'Under Review', false, false, 2),
('permit_review', 'needs-approval', 'Needs Approval', false, true, 3),
('permit_review', 'approved', 'Approved', true, false, 4),
('permit_review', 'rejected', 'Rejected', true, false, 5),

-- Appeal review statuses
('appeal_review', 'filed', 'Filed', false, false, 1),
('appeal_review', 'investigating', 'Investigating', false, false, 2),
('appeal_review', 'needs-approval', 'Needs Approval', false, true, 3),
('appeal_review', 'upheld', 'Appeal Upheld', true, false, 4),
('appeal_review', 'reduced', 'Value Reduced', true, false, 5),
('appeal_review', 'dismissed', 'Dismissed', true, false, 6),

-- Building review statuses
('building_review', 'scheduled', 'Scheduled', false, false, 1),
('building_review', 'in-progress', 'Field Work In Progress', false, false, 2),
('building_review', 'data-entry', 'Data Entry', false, false, 3),
('building_review', 'needs-approval', 'Needs Approval', false, true, 4),
('building_review', 'approved', 'Approved', true, false, 5),
('building_review', 'rejected', 'Rejected', true, false, 6),

-- Land review statuses
('land_review', 'scheduled', 'Scheduled', false, false, 1),
('land_review', 'in-progress', 'Field Work In Progress', false, false, 2),
('land_review', 'data-entry', 'Data Entry', false, false, 3),
('land_review', 'needs-approval', 'Needs Approval', false, true, 4),
('land_review', 'approved', 'Approved', true, false, 5),
('land_review', 'rejected', 'Rejected', true, false, 6),

-- Parcel review statuses (general)
('parcel_review', 'draft', 'Draft', false, false, 1),
('parcel_review', 'in-progress', 'In Progress', false, false, 2),
('parcel_review', 'needs-approval', 'Needs Approval', false, true, 3),
('parcel_review', 'approved', 'Approved', true, false, 4),
('parcel_review', 'rejected', 'Rejected', true, false, 5)
ON CONFLICT DO NOTHING;

-- Create sample employees
INSERT INTO public.employees_v2 (first_name, last_name, email, status, can_approve) VALUES
('John', 'Smith', 'john.smith@assessor.local', 'active', true),
('Sarah', 'Johnson', 'sarah.johnson@assessor.local', 'active', true),
('Mike', 'Williams', 'mike.williams@assessor.local', 'active', false),
('Lisa', 'Brown', 'lisa.brown@assessor.local', 'active', false),
('David', 'Jones', 'david.jones@assessor.local', 'active', true),
('Emily', 'Davis', 'emily.davis@assessor.local', 'active', false),
('Chris', 'Miller', 'chris.miller@assessor.local', 'active', false),
('Amanda', 'Wilson', 'amanda.wilson@assessor.local', 'active', false),
('Robert', 'Moore', 'robert.moore@assessor.local', 'active', true),
('Jennifer', 'Taylor', 'jennifer.taylor@assessor.local', 'active', false)
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- POPULATE LOOKUP TABLES
-- ============================================================

-- Insert neighborhoods
INSERT INTO public.neighborhoods_v2 (name, description) VALUES
('Downtown', 'Central business district with mixed commercial and residential'),
('Riverside', 'Residential area along the river with waterfront properties'),
('Oakwood', 'Established residential neighborhood with mature trees'),
('Pine Hills', 'Suburban residential area on elevated terrain'),
('Maple Grove', 'Family-friendly neighborhood with parks and schools'),
('Cedar Heights', 'Upscale residential area with larger lots'),
('Elmwood', 'Historic neighborhood with older homes'),
('Washington Park', 'Mixed residential area near the main park'),
('Lincoln Square', 'Urban residential with townhouses and condos'),
('Heritage Village', 'New development with modern amenities'),
('Sunset Ridge', 'Hillside residential with scenic views'),
('Morning Glory', 'Quiet residential area with garden homes'),
('Pleasant Valley', 'Rural residential with larger properties'),
('Green Acres', 'Suburban area with newer construction'),
('Hillcrest', 'Elevated residential area with custom homes'),
('Meadowbrook', 'Residential area near creek with nature access'),
('Stonegate', 'Gated community with luxury homes'),
('Fairview', 'Affordable housing area with starter homes'),
('Garden District', 'Residential area known for landscaping'),
('Old Town', 'Historic downtown residential area')
ON CONFLICT (name) DO NOTHING;

-- Insert tax statuses
INSERT INTO public.tax_statuses_v2 (name, description, is_active) VALUES
('taxable', 'Standard taxable property', true),
('exempt', 'Tax-exempt property (religious, government, etc.)', true),
('pending', 'Tax status under review', true),
('agricultural', 'Agricultural use exemption', true),
('senior_exemption', 'Senior citizen tax exemption', true),
('veteran_exemption', 'Veteran tax exemption', true),
('disabled_exemption', 'Disabled person tax exemption', true),
('historic_exemption', 'Historic property tax reduction', true),
('charitable_exempt', 'Charitable organization exemption', true),
('abated', 'Tax abatement program participant', true)
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- UTILITY FUNCTIONS FOR DATA GENERATION
-- ============================================================

-- Function to generate random owner names
DROP FUNCTION IF EXISTS random_owner_name();
CREATE OR REPLACE FUNCTION random_owner_name()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
    first_names text[] := ARRAY['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Christopher', 'Karen', 'Charles', 'Nancy', 'Daniel', 'Lisa', 'Matthew', 'Betty', 'Anthony', 'Helen', 'Mark', 'Sandra'];
    last_names text[] := ARRAY['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'];
    business_suffixes text[] := ARRAY['LLC', 'Inc', 'Corp', 'Trust', 'Holdings', 'Properties', 'Investments', 'Group'];
BEGIN
    -- 80% individuals, 20% businesses
    IF random() < 0.8 THEN
        RETURN first_names[floor(random() * array_length(first_names, 1) + 1)] || ' ' || 
               last_names[floor(random() * array_length(last_names, 1) + 1)];
    ELSE
        RETURN last_names[floor(random() * array_length(last_names, 1) + 1)] || ' ' || 
               business_suffixes[floor(random() * array_length(business_suffixes, 1) + 1)];
    END IF;
END;
$$;

-- Function to generate street names
DROP FUNCTION IF EXISTS random_street_name();
CREATE OR REPLACE FUNCTION random_street_name()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
    street_names text[] := ARRAY['Main', 'Oak', 'Pine', 'Maple', 'Cedar', 'Elm', 'Washington', 'Park', 'Walnut', 'Lincoln', 'Second', 'Third', 'First', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Church', 'Spring', 'Mill', 'River', 'School', 'High', 'State', 'Broad', 'Water', 'North', 'South'];
    street_types text[] := ARRAY['St', 'Ave', 'Dr', 'Ln', 'Rd', 'Blvd', 'Ct', 'Pl', 'Way', 'Cir'];
BEGIN
    RETURN street_names[floor(random() * array_length(street_names, 1) + 1)] || ' ' || 
           street_types[floor(random() * array_length(street_types, 1) + 1)];
END;
$$;

-- Function to generate neighborhood names
DROP FUNCTION IF EXISTS random_neighborhood();
CREATE OR REPLACE FUNCTION random_neighborhood()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
    neighborhoods text[] := ARRAY['Downtown', 'Riverside', 'Oakwood', 'Pine Hills', 'Maple Grove', 'Cedar Heights', 'Elmwood', 'Washington Park', 'Lincoln Square', 'Heritage Village', 'Sunset Ridge', 'Morning Glory', 'Pleasant Valley', 'Green Acres', 'Hillcrest', 'Meadowbrook', 'Stonegate', 'Fairview', 'Garden District', 'Old Town'];
BEGIN
    RETURN neighborhoods[floor(random() * array_length(neighborhoods, 1) + 1)];
END;
$$;

-- ============================================================
-- LARGE-SCALE DATA GENERATION
-- ============================================================

-- Create 100,000 parcels with buildings and land
DO $$
DECLARE
    block_num integer;
    lot_num integer;
    total_parcels integer := 100000;
    batch_size integer := 1000;
    current_batch integer := 0;
    start_time timestamp := now();
BEGIN
    RAISE NOTICE 'Starting generation of % parcels at %', total_parcels, start_time;
    
    -- Generate parcels in batches for performance
    WHILE current_batch * batch_size < total_parcels LOOP
        
        -- Insert addresses first for this batch
        WITH address_batch AS (
            INSERT INTO public.addresses_v2 (street_address, city, state, zip)
            SELECT DISTINCT
                (floor(random() * 9000) + 1000)::text || ' ' || random_street_name() as street_address,
                CASE 
                    WHEN gs % 3 = 0 THEN 'Springfield'
                    WHEN gs % 3 = 1 THEN 'Chicago' 
                    ELSE 'Peoria'
                END as city,
                'IL' as state,
                '62' || LPAD(floor(random() * 900 + 100)::text, 3, '0') as zip
            FROM generate_series(
                current_batch * batch_size * 2, 
                (current_batch + 1) * batch_size * 2 - 1
            ) gs
            ON CONFLICT (street_address, city, state, zip) DO NOTHING
            RETURNING id, street_address
        ),
        
        -- Insert parcels batch
        parcel_batch AS (
            INSERT INTO public.parcels_v2 (
                block, lot, ext, parcel_number,
                owner_name, tax_status_id, property_class,
                neighborhood_id, site_address_id, owner_address_id
            )
            SELECT 
                (gs / 50) + 1 as block,                    -- 50 lots per block
                (gs % 50) + 1 as lot,                      -- lots 1-50
                0 as ext,
                ((gs / 50) + 1)::text || '-' || ((gs % 50) + 1)::text || '-0' as parcel_number,
                random_owner_name() as owner_name,
                ts.id as tax_status_id,
                CASE 
                    WHEN random() < 0.70 THEN 'residential'
                    WHEN random() < 0.85 THEN 'commercial'
                    WHEN random() < 0.95 THEN 'industrial'
                    ELSE 'agricultural'
                END as property_class,
                n.id as neighborhood_id,
                sa.id as site_address_id,
                oa.id as owner_address_id
            FROM generate_series(
                current_batch * batch_size, 
                LEAST((current_batch + 1) * batch_size - 1, total_parcels - 1)
            ) gs
            CROSS JOIN (
                SELECT id FROM public.neighborhoods_v2 ORDER BY random() LIMIT 1
            ) n
            CROSS JOIN (
                SELECT id FROM public.tax_statuses_v2 
                WHERE name = CASE 
                    WHEN random() < 0.85 THEN 'taxable'
                    WHEN random() < 0.95 THEN 'exempt'
                    ELSE 'pending'
                END
                LIMIT 1
            ) ts
            CROSS JOIN LATERAL (
                SELECT id FROM address_batch ORDER BY random() LIMIT 1
            ) sa
            CROSS JOIN LATERAL (
                SELECT id FROM address_batch WHERE id != sa.id ORDER BY random() LIMIT 1
            ) oa
            RETURNING id, block, lot
        ),
        
        -- Insert buildings for each parcel
        building_batch AS (
            INSERT INTO public.buildings_v2 (
                parcel_id, year_built, square_footage, finished_area,
                bedrooms, bathrooms, building_type, condition_rating
            )
            SELECT 
                pb.id as parcel_id,
                floor(random() * 100) + 1925 as year_built,  -- 1925-2024
                floor(random() * 3500) + 800 as square_footage, -- 800-4300 sq ft
                floor(random() * 3500) + 800 as finished_area,
                floor(random() * 5) + 1 as bedrooms,        -- 1-5 bedrooms
                ROUND((random() * 3 + 1)::numeric, 1) as bathrooms, -- 1.0-4.0 baths
                CASE 
                    WHEN random() < 0.60 THEN 'single_family'
                    WHEN random() < 0.75 THEN 'duplex'
                    WHEN random() < 0.85 THEN 'townhouse'
                    WHEN random() < 0.90 THEN 'condo'
                    WHEN random() < 0.95 THEN 'apartment'
                    ELSE 'commercial'
                END as building_type,
                floor(random() * 10) + 1 as condition_rating  -- 1-10
            FROM parcel_batch pb
            RETURNING id, parcel_id
        )
        
        -- Insert land for each parcel
        INSERT INTO public.lands_v2 (
            parcel_id, area_sqft, frontage_ft, depth_ft, 
            land_use, topography
        )
        SELECT 
            pb.id as parcel_id,
            floor(random() * 15000) + 3000 as area_sqft,    -- 3000-18000 sq ft
            floor(random() * 100) + 30 as frontage_ft,      -- 30-130 ft
            floor(random() * 200) + 80 as depth_ft,         -- 80-280 ft
            CASE 
                WHEN random() < 0.60 THEN 'residential'
                WHEN random() < 0.75 THEN 'commercial'
                WHEN random() < 0.85 THEN 'industrial'
                WHEN random() < 0.95 THEN 'mixed_use'
                ELSE 'vacant'
            END as land_use,
            CASE 
                WHEN random() < 0.70 THEN 'level'
                WHEN random() < 0.85 THEN 'sloping'
                WHEN random() < 0.95 THEN 'rolling'
                ELSE 'steep'
            END as topography
        FROM parcel_batch pb;
        
        current_batch := current_batch + 1;
        
        -- Progress update every 10 batches
        IF current_batch % 10 = 0 THEN
            RAISE NOTICE 'Completed % parcels (% batches)', 
                current_batch * batch_size, current_batch;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Completed parcel generation in %', now() - start_time;
END;
$$;

-- ============================================================
-- GENERATE SALES DATA (with multiple parcels per sale)
-- ============================================================

-- Generate 15,000 sales (some with multiple parcels)
DO $$
DECLARE
    sale_count integer := 15000;
    batch_size integer := 1000;
    current_batch integer := 0;
    start_time timestamp := now();
    sale_id bigint;
    parcel_count integer;
BEGIN
    RAISE NOTICE 'Starting generation of % sales at %', sale_count, start_time;
    
    WHILE current_batch * batch_size < sale_count LOOP
        -- Insert sales batch
        WITH sales_batch AS (
            INSERT INTO public.sales_v2 (
                sale_date, sale_price, grantor, grantee, 
                sale_type, is_valid, sale_data
            )
            SELECT 
                (CURRENT_DATE - (random() * 2000)::integer) as sale_date, -- Last 5-6 years
                floor(random() * 500000) + 50000 as sale_price,          -- $50k-$550k
                random_owner_name() as grantor,
                random_owner_name() as grantee,
                CASE 
                    WHEN random() < 0.85 THEN 'arms_length'
                    WHEN random() < 0.92 THEN 'family_transfer'
                    WHEN random() < 0.96 THEN 'estate_sale'
                    ELSE 'foreclosure'
                END as sale_type,
                random() < 0.90 as is_valid,  -- 90% valid sales
                jsonb_build_object(
                    'deed_book', floor(random() * 1000) + 1000,
                    'deed_page', floor(random() * 500) + 1,
                    'deed_type', CASE 
                        WHEN random() < 0.80 THEN 'warranty'
                        WHEN random() < 0.90 THEN 'quitclaim'
                        ELSE 'special_warranty'
                    END
                ) as sale_data
            FROM generate_series(1, batch_size)
            RETURNING id, sale_price
        )
        -- Insert sales_parcels relationships
        INSERT INTO public.sales_parcels_v2 (sale_id, parcel_id, allocated_price, percentage)
        SELECT 
            sb.id as sale_id,
            p.parcel_id,
            CASE 
                WHEN p.parcel_count = 1 THEN sb.sale_price
                ELSE ROUND((sb.sale_price * p.portion)::numeric, 2)
            END as allocated_price,
            CASE 
                WHEN p.parcel_count = 1 THEN 100.00
                ELSE ROUND((p.portion * 100)::numeric, 2)
            END as percentage
        FROM sales_batch sb
        CROSS JOIN LATERAL (
            -- Determine number of parcels per sale (most sales are single parcel)
            SELECT 
                CASE 
                    WHEN random() < 0.85 THEN 1  -- 85% single parcel
                    WHEN random() < 0.96 THEN 2  -- 11% two parcels
                    WHEN random() < 0.99 THEN 3  -- 3% three parcels
                    ELSE 4                       -- 1% four parcels
                END as parcel_count
        ) pc
        CROSS JOIN LATERAL (
            -- Select random parcels and assign portions
            SELECT 
                p.id as parcel_id,
                pc.parcel_count,
                CASE 
                    WHEN pc.parcel_count = 1 THEN 1.0
                    ELSE (row_number() OVER ())::numeric / pc.parcel_count -- Equal portions for simplicity
                END as portion
            FROM (
                SELECT id 
                FROM public.parcels_v2 
                ORDER BY random() 
                LIMIT pc.parcel_count
            ) p
        ) p;
        
        current_batch := current_batch + 1;
        
        IF current_batch % 5 = 0 THEN
            RAISE NOTICE 'Generated % sales (% batches)', 
                current_batch * batch_size, current_batch;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Completed sales generation in %', now() - start_time;
END;
$$;

-- ============================================================
-- GENERATE PERMITS DATA
-- ============================================================

-- Generate 15,000 permits
DO $$
DECLARE
    permit_count integer := 15000;
    batch_size integer := 1000;
    current_batch integer := 0;
    start_time timestamp := now();
BEGIN
    RAISE NOTICE 'Starting generation of % permits at %', permit_count, start_time;
    
    WHILE current_batch * batch_size < permit_count LOOP
        INSERT INTO public.permits_v2 (
            parcel_id, permit_number, permit_type, issued_date,
            permit_value, work_description
        )
        SELECT 
            p.id as parcel_id,
            'P' || LPAD((current_batch * batch_size + (row_number() OVER ()))::text, 6, '0') as permit_number,
            CASE 
                WHEN random() < 0.30 THEN 'building'
                WHEN random() < 0.50 THEN 'renovation'
                WHEN random() < 0.65 THEN 'electrical'
                WHEN random() < 0.80 THEN 'plumbing'
                WHEN random() < 0.90 THEN 'roofing'
                ELSE 'demolition'
            END as permit_type,
            CASE 
                WHEN random() < 0.85 THEN (CURRENT_DATE - (random() * 900)::integer)
                ELSE NULL  -- 15% pending permits
            END as issued_date,
            floor(random() * 100000) + 1000 as permit_value,
            CASE 
                WHEN random() < 0.25 THEN 'Kitchen renovation'
                WHEN random() < 0.40 THEN 'Bathroom remodel'
                WHEN random() < 0.55 THEN 'Roof replacement'
                WHEN random() < 0.70 THEN 'HVAC installation'
                WHEN random() < 0.80 THEN 'Electrical upgrade'
                WHEN random() < 0.90 THEN 'Deck construction'
                ELSE 'General repairs'
            END as work_description
        FROM (
            SELECT id
            FROM public.parcels_v2 
            ORDER BY random()
            LIMIT batch_size
            OFFSET current_batch * batch_size
        ) p;
        
        current_batch := current_batch + 1;
        
        IF current_batch % 5 = 0 THEN
            RAISE NOTICE 'Generated % permits (% batches)', 
                current_batch * batch_size, current_batch;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Completed permits generation in %', now() - start_time;
END;
$$;

-- ============================================================
-- GENERATE REVIEWS DATA
-- ============================================================

-- Generate 5,000 reviews across different types
DO $$
DECLARE
    review_count integer := 5000;
    batch_size integer := 500;
    current_batch integer := 0;
    start_time timestamp := now();
    employee_ids bigint[];
BEGIN
    -- Get employee IDs for assignment
    SELECT array_agg(id) INTO employee_ids FROM public.employees_v2;
    
    RAISE NOTICE 'Starting generation of % reviews at %', review_count, start_time;
    
    WHILE current_batch * batch_size < review_count LOOP
        -- Generate parcel reviews
        INSERT INTO public.reviews_v2 (
            kind, title, current_status_id, assigned_to_id, data, created_by
        )
        SELECT 
            'parcel_review'::review_kind_v2 as kind,
            'Parcel Assessment Review - ' || p.parcel_number as title,
            rs.id as current_status_id,
            employee_ids[floor(random() * array_length(employee_ids, 1) + 1)] as assigned_to_id,
            jsonb_build_object(
                'parcel_id', p.id,
                'review_reason', CASE 
                    WHEN random() < 0.30 THEN 'ownership_change'
                    WHEN random() < 0.55 THEN 'value_appeal'
                    WHEN random() < 0.75 THEN 'new_construction'
                    WHEN random() < 0.90 THEN 'periodic_review'
                    ELSE 'data_correction'
                END
            ) as data,
            '4be94f1c-078e-4810-8b6c-f2800a3c02f8'::uuid as created_by
        FROM (
            SELECT id, parcel_number
            FROM public.parcels_v2 
            ORDER BY random()
            LIMIT batch_size / 2
            OFFSET current_batch * (batch_size / 2)
        ) p
        CROSS JOIN (
            SELECT id FROM public.review_statuses_v2 
            WHERE review_kind = 'parcel_review' AND slug = 'draft'
        ) rs;
        
        -- Generate building reviews
        INSERT INTO public.reviews_v2 (
            kind, title, current_status_id, assigned_to_id, data, created_by
        )
        SELECT 
            'building_review'::review_kind_v2 as kind,
            'Building Assessment - ' || p.parcel_number as title,
            rs.id as current_status_id,
            employee_ids[floor(random() * array_length(employee_ids, 1) + 1)] as assigned_to_id,
            jsonb_build_object(
                'parcel_id', p.id,
                'building_id', b.id,
                'review_reason', CASE 
                    WHEN random() < 0.40 THEN 'condition_change'
                    WHEN random() < 0.70 THEN 'addition_renovation'
                    ELSE 'routine_inspection'
                END
            ) as data,
            '4be94f1c-078e-4810-8b6c-f2800a3c02f8'::uuid as created_by
        FROM (
            SELECT p.id, p.parcel_number, b.id as building_id
            FROM public.parcels_v2 p
            JOIN public.buildings_v2 b ON p.id = b.parcel_id
            ORDER BY random()
            LIMIT batch_size / 2
            OFFSET current_batch * (batch_size / 2)
        ) p(id, parcel_number, building_id)
        JOIN public.buildings_v2 b ON p.building_id = b.id
        CROSS JOIN (
            SELECT id FROM public.review_statuses_v2 
            WHERE review_kind = 'building_review' AND slug = 'scheduled'
        ) rs;
        
        current_batch := current_batch + 1;
        
        IF current_batch % 3 = 0 THEN
            RAISE NOTICE 'Generated reviews for batch %', current_batch;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Completed reviews generation in %', now() - start_time;
END;
$$;

-- ============================================================
-- GENERATE APPEALS DATA
-- ============================================================

-- Generate 1,000 appeals
INSERT INTO public.appeals_v2 (
    parcel_id, appeal_number, filed_date, appeal_level,
    appellant_name, appellant_address, reason_for_appeal, current_assessment,
    requested_assessment
)
SELECT 
    p.id as parcel_id,
    'A' || LPAD((row_number() OVER ())::text, 6, '0') as appeal_number,
    (CURRENT_DATE - (random() * 365)::integer) as filed_date,
    CASE 
        WHEN random() < 0.80 THEN 'informal'
        WHEN random() < 0.95 THEN 'formal'
        ELSE 'board'
    END as appeal_level,
    p.owner_name as appellant_name,
    oa.street_address || COALESCE(', ' || oa.city, '') || COALESCE(', ' || oa.state, '') || COALESCE(' ' || oa.zip, '') as appellant_address,
    CASE 
        WHEN random() < 0.50 THEN 'overvaluation'
        WHEN random() < 0.75 THEN 'property_damage'
        WHEN random() < 0.85 THEN 'incorrect_classification'
        WHEN random() < 0.95 THEN 'exemption_eligibility'
        ELSE 'data_error'
    END as reason_for_appeal,
    floor(random() * 400000) + 100000 as current_assessment,
    floor(random() * 300000) + 50000 as requested_assessment
FROM (
    SELECT p.id, p.owner_name, p.owner_address_id
    FROM public.parcels_v2 p
    ORDER BY random()
    LIMIT 1000
) p
LEFT JOIN public.addresses_v2 oa ON p.owner_address_id = oa.id;

-- ============================================================
-- GENERATE HISTORICAL SNAPSHOTS
-- ============================================================

-- Generate historical parcel snapshots (simulating past reviews)
DO $$
DECLARE
    snapshot_count integer := 10000;
    batch_size integer := 1000;
    current_batch integer := 0;
    start_time timestamp := now();
    review_ids bigint[];
BEGIN
    -- Get existing review IDs for linking snapshots
    SELECT array_agg(id) INTO review_ids FROM public.reviews_v2 LIMIT 5000;
    
    RAISE NOTICE 'Starting generation of % parcel snapshots at %', snapshot_count, start_time;
    
    WHILE current_batch * batch_size < snapshot_count LOOP
        INSERT INTO public.parcel_snapshots_v2 (
            parcel_id, review_id, snapshot_date, block, lot, ext, parcel_number,
            tax_status_id, property_class, owner_name, owner_address_id,
            site_address_id, neighborhood_id, parcel_data, created_by
        )
        SELECT 
            p.id as parcel_id,
            review_ids[floor(random() * array_length(review_ids, 1) + 1)] as review_id,
            (CURRENT_DATE - (random() * 1000)::integer) as snapshot_date, -- Historical dates
            p.block,
            p.lot,
            p.ext,
            p.parcel_number,
            p.tax_status_id,
            p.property_class,
            p.owner_name,
            p.owner_address_id,
            p.site_address_id,
            p.neighborhood_id,
            jsonb_build_object(
                'snapshot_reason', CASE 
                    WHEN random() < 0.30 THEN 'ownership_change'
                    WHEN random() < 0.55 THEN 'assessment_update'
                    WHEN random() < 0.75 THEN 'status_change'
                    WHEN random() < 0.90 THEN 'data_correction'
                    ELSE 'periodic_review'
                END,
                'previous_value', floor(random() * 100000) + 50000,
                'assessed_value', floor(random() * 150000) + 75000
            ) as parcel_data,
            '4be94f1c-078e-4810-8b6c-f2800a3c02f8'::uuid as created_by
        FROM (
            SELECT id, block, lot, ext, parcel_number, tax_status_id, property_class,
                   owner_name, owner_address_id, site_address_id, neighborhood_id
            FROM public.parcels_v2 
            ORDER BY random()
            LIMIT batch_size
            OFFSET current_batch * batch_size
        ) p;
        
        current_batch := current_batch + 1;
        
        IF current_batch % 5 = 0 THEN
            RAISE NOTICE 'Generated % parcel snapshots (% batches)', 
                current_batch * batch_size, current_batch;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Completed parcel snapshots generation in %', now() - start_time;
END;
$$;

-- Generate historical building snapshots
DO $$
DECLARE
    snapshot_count integer := 8000;
    batch_size integer := 1000;
    current_batch integer := 0;
    start_time timestamp := now();
    review_ids bigint[];
BEGIN
    -- Get building review IDs specifically
    SELECT array_agg(id) INTO review_ids 
    FROM public.reviews_v2 
    WHERE kind = 'building_review';
    
    RAISE NOTICE 'Starting generation of % building snapshots at %', snapshot_count, start_time;
    
    WHILE current_batch * batch_size < snapshot_count LOOP
        INSERT INTO public.building_snapshots_v2 (
            building_id, review_id, snapshot_date, year_built, square_footage,
            finished_area, bedrooms, bathrooms, condition_rating,
            building_type, building_data
        )
        SELECT 
            b.id as building_id,
            review_ids[floor(random() * array_length(review_ids, 1) + 1)] as review_id,
            (CURRENT_DATE - (random() * 1200)::integer) as snapshot_date, -- Historical dates
            b.year_built,
            b.square_footage + floor((random() - 0.5) * 200) as square_footage, -- Slight variations
            b.finished_area + floor((random() - 0.5) * 150) as finished_area,
            b.bedrooms,
            b.bathrooms,
            GREATEST(1, LEAST(10, b.condition_rating + floor((random() - 0.5) * 2))) as condition_rating, -- Historical condition
            b.building_type,
            jsonb_build_object(
                'inspection_type', CASE 
                    WHEN random() < 0.40 THEN 'routine'
                    WHEN random() < 0.70 THEN 'permit_inspection'
                    WHEN random() < 0.85 THEN 'appeal_review'
                    ELSE 'damage_assessment'
                END,
                'inspector_notes', CASE 
                    WHEN random() < 0.25 THEN 'Good condition, no issues noted'
                    WHEN random() < 0.50 THEN 'Minor maintenance needed'
                    WHEN random() < 0.75 THEN 'Some wear noted, condition fair'
                    ELSE 'Significant improvements made'
                END,
                'previous_sqft', b.square_footage,
                'change_reason', CASE 
                    WHEN random() < 0.30 THEN 'renovation'
                    WHEN random() < 0.60 THEN 'addition'
                    WHEN random() < 0.80 THEN 'repair'
                    ELSE 'routine_update'
                END
            ) as building_data
        FROM (
            SELECT id, year_built, square_footage, finished_area, bedrooms, 
                   bathrooms, condition_rating, building_type
            FROM public.buildings_v2 
            ORDER BY random()
            LIMIT batch_size
            OFFSET current_batch * batch_size
        ) b
        WHERE review_ids IS NOT NULL AND array_length(review_ids, 1) > 0;
        
        current_batch := current_batch + 1;
        
        IF current_batch % 4 = 0 THEN
            RAISE NOTICE 'Generated % building snapshots (% batches)', 
                current_batch * batch_size, current_batch;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Completed building snapshots generation in %', now() - start_time;
END;
$$;

-- Generate historical land snapshots
DO $$
DECLARE
    snapshot_count integer := 6000;
    batch_size integer := 1000;
    current_batch integer := 0;
    start_time timestamp := now();
    review_ids bigint[];
BEGIN
    -- Get land review IDs specifically
    SELECT array_agg(id) INTO review_ids 
    FROM public.reviews_v2 
    WHERE kind = 'land_review';
    
    RAISE NOTICE 'Starting generation of % land snapshots at %', snapshot_count, start_time;
    
    WHILE current_batch * batch_size < snapshot_count LOOP
        INSERT INTO public.land_snapshots_v2 (
            land_id, review_id, snapshot_date, area_sqft, frontage_ft,
            depth_ft, land_use, topography, land_data
        )
        SELECT 
            l.id as land_id,
            review_ids[floor(random() * array_length(review_ids, 1) + 1)] as review_id,
            (CURRENT_DATE - (random() * 800)::integer) as snapshot_date, -- Historical dates
            l.area_sqft,
            l.frontage_ft,
            l.depth_ft,
            l.land_use,
            l.topography,
            jsonb_build_object(
                'survey_type', CASE 
                    WHEN random() < 0.40 THEN 'boundary_verification'
                    WHEN random() < 0.70 THEN 'topographic_survey'
                    WHEN random() < 0.85 THEN 'environmental_assessment'
                    ELSE 'utility_easement'
                END,
                'survey_date', (CURRENT_DATE - (random() * 600)::integer),
                'surveyor', random_owner_name(),
                'findings', CASE 
                    WHEN random() < 0.25 THEN 'No boundary disputes, clear title'
                    WHEN random() < 0.50 THEN 'Minor encroachment noted'
                    WHEN random() < 0.75 THEN 'Utility easement updated'
                    ELSE 'Environmental clearance confirmed'
                END,
                'land_value_sqft', ROUND((random() * 50 + 10)::numeric, 2)
            ) as land_data
        FROM (
            SELECT id, area_sqft, frontage_ft, depth_ft, land_use, topography
            FROM public.lands_v2 
            ORDER BY random()
            LIMIT batch_size
            OFFSET current_batch * batch_size
        ) l
        WHERE review_ids IS NOT NULL AND array_length(review_ids, 1) > 0;
        
        current_batch := current_batch + 1;
        
        IF current_batch % 3 = 0 THEN
            RAISE NOTICE 'Generated % land snapshots (% batches)', 
                current_batch * batch_size, current_batch;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Completed land snapshots generation in %', now() - start_time;
END;
$$;

-- ============================================================
-- PERFORMANCE OPTIMIZATION
-- ============================================================

-- Analyze tables for better query performance
ANALYZE public.parcels_v2;
ANALYZE public.buildings_v2;
ANALYZE public.lands_v2;
ANALYZE public.sales_v2;
ANALYZE public.permits_v2;
ANALYZE public.reviews_v2;
ANALYZE public.appeals_v2;

-- ============================================================
-- CLEANUP
-- ============================================================

-- Drop temporary functions
DROP FUNCTION IF EXISTS random_owner_name();
DROP FUNCTION IF EXISTS random_street_name();
DROP FUNCTION IF EXISTS random_neighborhood();

-- ============================================================
-- SUMMARY REPORT
-- ============================================================

DO $$
DECLARE
    parcel_count bigint;
    building_count bigint;
    land_count bigint;
    sale_count bigint;
    sales_parcels_count bigint;
    permit_count bigint;
    review_count bigint;
    appeal_count bigint;
    parcel_snapshot_count bigint;
    building_snapshot_count bigint;
    land_snapshot_count bigint;
    neighborhood_count bigint;
    tax_status_count bigint;
    address_count bigint;
BEGIN
    SELECT count(*) INTO parcel_count FROM public.parcels_v2;
    SELECT count(*) INTO building_count FROM public.buildings_v2;
    SELECT count(*) INTO land_count FROM public.lands_v2;
    SELECT count(*) INTO sale_count FROM public.sales_v2;
    SELECT count(*) INTO sales_parcels_count FROM public.sales_parcels_v2;
    SELECT count(*) INTO permit_count FROM public.permits_v2;
    SELECT count(*) INTO review_count FROM public.reviews_v2;
    SELECT count(*) INTO appeal_count FROM public.appeals_v2;
    SELECT count(*) INTO parcel_snapshot_count FROM public.parcel_snapshots_v2;
    SELECT count(*) INTO building_snapshot_count FROM public.building_snapshots_v2;
    SELECT count(*) INTO land_snapshot_count FROM public.land_snapshots_v2;
    SELECT count(*) INTO neighborhood_count FROM public.neighborhoods_v2;
    SELECT count(*) INTO tax_status_count FROM public.tax_statuses_v2;
    SELECT count(*) INTO address_count FROM public.addresses_v2;
    
    RAISE NOTICE '============================================================';
    RAISE NOTICE 'SEED DATA GENERATION COMPLETE';
    RAISE NOTICE '============================================================';
    RAISE NOTICE 'Lookup Tables:';
    RAISE NOTICE '  Neighborhoods:     %', neighborhood_count;
    RAISE NOTICE '  Tax Statuses:      %', tax_status_count;
    RAISE NOTICE '  Addresses:         %', address_count;
    RAISE NOTICE '';
    RAISE NOTICE 'Core Tables:';
    RAISE NOTICE '  Parcels:           %', parcel_count;
    RAISE NOTICE '  Buildings:         %', building_count;
    RAISE NOTICE '  Lands:             %', land_count;
    RAISE NOTICE '';
    RAISE NOTICE 'Transaction Tables:';
    RAISE NOTICE '  Sales:             %', sale_count;
    RAISE NOTICE '  Sales-Parcels:     %', sales_parcels_count;
    RAISE NOTICE '  Permits:           %', permit_count;
    RAISE NOTICE '  Reviews:           %', review_count;
    RAISE NOTICE '  Appeals:           %', appeal_count;
    RAISE NOTICE '';
    RAISE NOTICE 'Historical Tables:';
    RAISE NOTICE '  Parcel Snapshots:  %', parcel_snapshot_count;
    RAISE NOTICE '  Building Snapshots: %', building_snapshot_count;
    RAISE NOTICE '  Land Snapshots:    %', land_snapshot_count;
    RAISE NOTICE '============================================================';
END;
$$;

-- ============================================================
-- END SEED-V2.SQL
-- ============================================================