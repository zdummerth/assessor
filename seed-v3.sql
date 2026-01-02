-- ============================================================
-- SEED-V3.SQL: Large-scale test data generation with value and use management
-- Creates 100,000+ parcels with buildings, land, sales, reviews, values, and uses
-- ============================================================

-- ============================================================
-- SEED DEFAULT STATUSES AND EMPLOYEES
-- ============================================================

-- Insert default review statuses for all review types (including new ones)
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
('parcel_review', 'rejected', 'Rejected', true, false, 5),

-- NEW: Building valuation statuses
('building_valuation', 'scheduled', 'Scheduled', false, false, 1),
('building_valuation', 'in-progress', 'In Progress', false, false, 2),
('building_valuation', 'needs-approval', 'Needs Approval', false, true, 3),
('building_valuation', 'approved', 'Approved', true, false, 4),
('building_valuation', 'rejected', 'Rejected', true, false, 5),

-- NEW: Land valuation statuses
('land_valuation', 'scheduled', 'Scheduled', false, false, 1),
('land_valuation', 'in-progress', 'In Progress', false, false, 2),
('land_valuation', 'needs-approval', 'Needs Approval', false, true, 3),
('land_valuation', 'approved', 'Approved', true, false, 4),
('land_valuation', 'rejected', 'Rejected', true, false, 5),

-- NEW: Value calculation statuses
('value_calculation', 'draft', 'Draft', false, false, 1),
('value_calculation', 'calculating', 'Calculating', false, false, 2),
('value_calculation', 'needs-approval', 'Needs Approval', false, true, 3),
('value_calculation', 'approved', 'Approved', true, false, 4),
('value_calculation', 'rejected', 'Rejected', true, false, 5),

-- NEW: Use conversion statuses
('use_conversion', 'requested', 'Requested', false, false, 1),
('use_conversion', 'investigating', 'Investigating', false, false, 2),
('use_conversion', 'needs-approval', 'Needs Approval', false, true, 3),
('use_conversion', 'approved', 'Approved', true, false, 4),
('use_conversion', 'rejected', 'Rejected', true, false, 5)
ON CONFLICT (review_kind, slug) DO NOTHING;

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
-- NEW: POPULATE VALUE AND USE MANAGEMENT LOOKUP TABLES
-- ============================================================

-- Insert assessment cycles
INSERT INTO public.assessment_cycles_v2 (tax_year, start_date, end_date, is_active, description) VALUES
(2023, '2023-01-01', '2023-12-31', false, '2023 Assessment Cycle - Completed'),
(2024, '2024-01-01', '2024-12-31', false, '2024 Assessment Cycle - Completed'),
(2025, '2025-01-01', '2025-12-31', false, '2025 Assessment Cycle - Completed'),
(2026, '2026-01-01', '2026-12-31', true, '2026 Assessment Cycle - Active'),
(2027, '2027-01-01', '2027-12-31', false, '2027 Assessment Cycle - Planned')
ON CONFLICT (tax_year) DO NOTHING;

-- Insert property uses
INSERT INTO public.property_uses_v2 (name, description, category, is_active) VALUES
-- Residential uses
('single_family', 'Single family detached home', 'residential', true),
('multi_family', 'Multi-family residential building (2-4 units)', 'residential', true),
('townhouse', 'Townhouse or row house', 'residential', true),
('condominium', 'Condominium unit', 'residential', true),
('apartment', 'Apartment building (5+ units)', 'residential', true),
('mobile_home', 'Mobile or manufactured home', 'residential', true),

-- Commercial uses
('retail', 'Retail commercial space', 'commercial', true),
('office', 'Office commercial space', 'commercial', true),
('restaurant', 'Restaurant or food service', 'commercial', true),
('hotel', 'Hotel or lodging facility', 'commercial', true),
('gas_station', 'Gas station or convenience store', 'commercial', true),
('shopping_center', 'Shopping center or mall', 'commercial', true),
('bank', 'Financial institution', 'commercial', true),

-- Industrial uses
('warehouse', 'Industrial warehouse or storage', 'industrial', true),
('manufacturing', 'Manufacturing facility', 'industrial', true),
('distribution', 'Distribution center', 'industrial', true),
('auto_repair', 'Automotive repair facility', 'industrial', true),

-- Agricultural uses
('crop_land', 'Agricultural crop production', 'agricultural', true),
('pasture', 'Livestock pasture land', 'agricultural', true),
('farmstead', 'Farm buildings and residence', 'agricultural', true),
('orchard', 'Fruit or nut orchard', 'agricultural', true),

-- Mixed and special uses
('mixed_use', 'Mixed residential and commercial', 'commercial', true),
('vacant_land', 'Vacant developable land', 'residential', true),
('parking', 'Parking lot or garage', 'commercial', true),
('institutional', 'Government, religious, or institutional', 'commercial', true)
ON CONFLICT (name) DO NOTHING;

-- Insert valuation methods
INSERT INTO public.valuation_methods_v2 (name, description, calculation_formula, requires_comparables, requires_income_data, requires_cost_data, is_active) VALUES
('cost_approach', 'Cost approach valuation based on replacement cost less depreciation', 'Replacement Cost New - Physical Depreciation - Functional Obsolescence - External Obsolescence', false, false, true, true),
('sales_comparison', 'Sales comparison approach using comparable sales', 'Subject Property Value = Comparable Sale Price ± Adjustments', true, false, false, true),
('income_approach', 'Income capitalization approach for income-producing properties', 'Property Value = Net Operating Income / Capitalization Rate', false, true, false, true),
('custom_approach', 'Custom valuation method for unique properties', 'Varies based on property characteristics', false, false, false, true),
('assessed_value', 'Current assessed value from tax records', 'Current Assessment × Market Factor', false, false, false, true)
ON CONFLICT (name) DO NOTHING;

-- Insert value types  
INSERT INTO public.value_types_v2 (name, description, tax_category, is_active) VALUES
('residential', 'Residential property value component', 'residential', true),
('commercial', 'Commercial property value component', 'commercial', true),
('agricultural', 'Agricultural property value component', 'agricultural', true),
('industrial', 'Industrial property value component', 'industrial', true),
('mixed_use', 'Mixed-use property value component', 'mixed', true)
ON CONFLICT (name) DO NOTHING;

-- Insert standardized value components
INSERT INTO public.value_components_v2 (name, description, component_category, applies_to, calculation_method, is_active) VALUES
-- Building components
('foundation', 'Foundation and basement structure', 'structure', 'building', 'Cost per square foot based on foundation type', true),
('framing', 'Structural framing and supports', 'structure', 'building', 'Cost per square foot based on framing material', true),
('roofing', 'Roof structure and covering', 'exterior', 'building', 'Cost per square foot of roof area', true),
('exterior_walls', 'Exterior walls and siding', 'exterior', 'building', 'Cost per linear foot of perimeter', true),
('windows_doors', 'Windows and exterior doors', 'exterior', 'building', 'Cost per unit based on quality grade', true),
('electrical', 'Electrical systems and fixtures', 'mechanical', 'building', 'Cost per square foot based on amperage and complexity', true),
('plumbing', 'Plumbing systems and fixtures', 'mechanical', 'building', 'Cost per fixture unit and bathroom', true),
('hvac', 'Heating, ventilation, and air conditioning', 'mechanical', 'building', 'Cost per square foot based on system type', true),
('interior_finishes', 'Flooring, walls, and ceiling finishes', 'interior', 'building', 'Cost per square foot based on finish quality', true),
('kitchen', 'Kitchen cabinets and built-ins', 'interior', 'building', 'Lump sum based on size and quality', true),
('bathrooms', 'Bathroom fixtures and finishes', 'interior', 'building', 'Cost per bathroom based on quality', true),
('insulation', 'Building insulation systems', 'mechanical', 'building', 'Cost per square foot based on R-value', true),

-- Land components  
('raw_land', 'Base land value before improvements', 'land_base', 'land', 'Cost per square foot based on location and zoning', true),
('site_preparation', 'Grading, excavation, and site prep', 'improvements', 'land', 'Lump sum based on topography and size', true),
('utilities', 'Utility connections and infrastructure', 'improvements', 'land', 'Cost per connection type available', true),
('landscaping', 'Landscaping and outdoor improvements', 'improvements', 'land', 'Cost based on maturity and extent', true),
('paving_drives', 'Driveways and paved surfaces', 'improvements', 'land', 'Cost per square foot of paving', true),
('drainage', 'Drainage systems and improvements', 'improvements', 'land', 'Cost based on drainage requirements', true),
('fencing', 'Fencing and property boundaries', 'improvements', 'land', 'Cost per linear foot of fencing', true),
('outbuildings', 'Sheds, garages, and other structures', 'improvements', 'land', 'Cost per square foot of structure area', true)
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

-- Function to get random use by category
DROP FUNCTION IF EXISTS random_use_by_category();
CREATE OR REPLACE FUNCTION random_use_by_category(use_category text)
RETURNS bigint
LANGUAGE plpgsql
AS $$
DECLARE
    use_id bigint;
BEGIN
    SELECT id INTO use_id 
    FROM public.property_uses_v2 
    WHERE category = use_category AND is_active = true
    ORDER BY random() 
    LIMIT 1;
    
    RETURN use_id;
END;
$$;

-- ============================================================
-- LARGE-SCALE DATA GENERATION
-- ============================================================

-- Create 100,000 parcels with buildings, land, and uses
DO $$
DECLARE
    block_num integer;
    lot_num integer;
    total_parcels integer := 100000;
    batch_size integer := 500;
    current_batch integer := 0;
    start_time timestamp := now();
BEGIN
    RAISE NOTICE 'Starting generation of % parcels with enhanced use tracking at %', total_parcels, start_time;
    
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
                (gs / 50) + 1 as block,
                (gs % 50) + 1 as lot,
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
            RETURNING id, block, lot, property_class
        ),
        
        -- Insert buildings with best use tracking
        building_batch AS (
            INSERT INTO public.buildings_v2 (
                parcel_id, year_built, square_footage, finished_area,
                bedrooms, bathrooms, building_type, condition_rating,
                best_use_id, best_use_updated_at, best_use_reason
            )
            SELECT 
                pb.id as parcel_id,
                floor(random() * 100) + 1925 as year_built,
                floor(random() * 3500) + 800 as square_footage,
                floor(random() * 3500) + 800 as finished_area,
                floor(random() * 5) + 1 as bedrooms,
                ROUND((random() * 3 + 1)::numeric, 1) as bathrooms,
                CASE 
                    WHEN random() < 0.60 THEN 'single_family'
                    WHEN random() < 0.75 THEN 'duplex'
                    WHEN random() < 0.85 THEN 'townhouse'
                    WHEN random() < 0.90 THEN 'condo'
                    WHEN random() < 0.95 THEN 'apartment'
                    ELSE 'commercial'
                END as building_type,
                floor(random() * 10) + 1 as condition_rating,
                -- Set best use based on property class
                CASE 
                    WHEN pb.property_class = 'residential' THEN random_use_by_category('residential')
                    WHEN pb.property_class = 'commercial' THEN random_use_by_category('commercial')
                    WHEN pb.property_class = 'industrial' THEN random_use_by_category('industrial')
                    ELSE random_use_by_category('agricultural')
                END as best_use_id,
                current_date - (random() * 365)::integer as best_use_updated_at,
                'Initial assessment determination' as best_use_reason
            FROM parcel_batch pb
            RETURNING id, parcel_id, best_use_id
        ),
        
        -- Insert land with best use tracking
        land_batch AS (
            INSERT INTO public.lands_v2 (
                parcel_id, area_sqft, frontage_ft, depth_ft, 
                land_use, topography, best_use_id, best_use_updated_at, best_use_reason
            )
            SELECT 
                pb.id as parcel_id,
                floor(random() * 15000) + 3000 as area_sqft,
                floor(random() * 100) + 30 as frontage_ft,
                floor(random() * 200) + 80 as depth_ft,
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
                END as topography,
                -- Set best use based on property class  
                CASE 
                    WHEN pb.property_class = 'residential' THEN random_use_by_category('residential')
                    WHEN pb.property_class = 'commercial' THEN random_use_by_category('commercial')
                    WHEN pb.property_class = 'industrial' THEN random_use_by_category('industrial')
                    ELSE random_use_by_category('agricultural')
                END as best_use_id,
                current_date - (random() * 365)::integer as best_use_updated_at,
                'Initial assessment determination' as best_use_reason
            FROM parcel_batch pb
            RETURNING id, parcel_id, best_use_id
        ),
        
        -- Insert current uses for buildings (some with multiple uses)
        building_uses AS (
            INSERT INTO public.building_current_uses_v2 (building_id, use_id, percentage_allocation, effective_date, use_notes)
            SELECT 
                bb.id as building_id,
                CASE 
                    WHEN random() < 0.85 THEN bb.best_use_id  -- 85% match best use
                    ELSE random_use_by_category('residential')  -- 15% different current use
                END as use_id,
                CASE 
                    WHEN random() < 0.90 THEN 100.0  -- 90% single use
                    ELSE 70.0 + random() * 30.0      -- 10% partial use
                END as percentage_allocation,
                current_date - (random() * 730)::integer as effective_date,
                CASE 
                    WHEN random() < 0.80 THEN 'Primary use'
                    WHEN random() < 0.95 THEN 'Converted from previous use'  
                    ELSE 'Mixed use arrangement'
                END as use_notes
            FROM building_batch bb
            RETURNING building_id
        )
        
        -- Insert current uses for land (some with multiple uses)
        INSERT INTO public.land_current_uses_v2 (land_id, use_id, percentage_allocation, effective_date, use_notes)
        SELECT 
            lb.id as land_id,
            CASE 
                WHEN random() < 0.85 THEN lb.best_use_id  -- 85% match best use
                ELSE random_use_by_category('residential')  -- 15% different current use
            END as use_id,
            CASE 
                WHEN random() < 0.90 THEN 100.0  -- 90% single use
                ELSE 60.0 + random() * 40.0      -- 10% partial use  
            END as percentage_allocation,
            current_date - (random() * 730)::integer as effective_date,
            CASE 
                WHEN random() < 0.80 THEN 'Primary land use'
                WHEN random() < 0.95 THEN 'Zoning compliant use'
                ELSE 'Mixed development'
            END as use_notes
        FROM land_batch lb;
        
        current_batch := current_batch + 1;
        
        -- Progress update every 10 batches
        IF current_batch % 10 = 0 THEN
            RAISE NOTICE 'Completed % parcels with uses (% batches)', 
                current_batch * batch_size, current_batch;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Completed parcel and use generation in %', now() - start_time;
END;
$$;

-- ============================================================
-- GENERATE VALUE CALCULATIONS
-- ============================================================

-- Generate building values for current assessment cycle
DO $$
DECLARE
    value_count integer := 10000; 
    batch_size integer := 500;
    current_batch integer := 0;
    start_time timestamp := now();
    current_cycle_id bigint;
    method_ids bigint[];
    value_type_ids bigint[];
    approver_employee_ids bigint[];
BEGIN
    -- Get current assessment cycle
    SELECT id INTO current_cycle_id 
    FROM public.assessment_cycles_v2 
    WHERE is_active = true LIMIT 1;
    
    -- Get method and value type IDs
    SELECT array_agg(id) INTO method_ids FROM public.valuation_methods_v2 WHERE is_active = true;
    SELECT array_agg(id) INTO value_type_ids FROM public.value_types_v2 WHERE is_active = true;
    
    -- Get employee IDs who can approve
    SELECT array_agg(id) INTO approver_employee_ids FROM public.employees_v2 WHERE can_approve = true;
    
    RAISE NOTICE 'Starting generation of % building values at %', value_count, start_time;
    
    WHILE current_batch * batch_size < value_count LOOP
        -- Generate building values
        WITH building_batch AS (
            SELECT id, parcel_id, square_footage, condition_rating, best_use_id, random() as approval_rand
            FROM public.buildings_v2 
            ORDER BY random()
            LIMIT batch_size
            OFFSET current_batch * batch_size
        ),
        value_batch AS (
            INSERT INTO public.building_values_v2 (
                building_id, assessment_cycle_id, method_id, 
                current_use_id, best_use_id, scheduled_calculation_date,
                calculation_trigger, status, total_value, 
                calculation_completed_at, approved_at, approved_by,
                is_active, activated_at, calculation_metadata, created_by
            )
            SELECT 
                bb.id as building_id,
                current_cycle_id as assessment_cycle_id,
                method_ids[floor(random() * array_length(method_ids, 1) + 1)] as method_id,
                bb.best_use_id as current_use_id,
                bb.best_use_id as best_use_id,
                current_date - (random() * 90)::integer as scheduled_calculation_date,
                CASE 
                    WHEN random() < 0.60 THEN 'immediate'
                    WHEN random() < 0.85 THEN 'next_cycle'
                    ELSE 'custom_date'
                END as calculation_trigger,
                -- Use consistent random value for approval workflow
                CASE 
                    WHEN bb.approval_rand < 0.70 THEN 'approved'
                    WHEN bb.approval_rand < 0.85 THEN 'pending_approval'
                    WHEN bb.approval_rand < 0.95 THEN 'draft'
                    ELSE 'rejected'
                END as status,
                -- Base value on square footage and condition
                ROUND((bb.square_footage * (50 + random() * 100) * (bb.condition_rating / 10.0))::numeric, 2) as total_value,
                current_date - (random() * 60)::integer as calculation_completed_at,
                -- Ensure is_active constraint is satisfied: active values must have approved_at
                CASE 
                    WHEN bb.approval_rand < 0.70 THEN current_date - (random() * 30)::integer
                    ELSE NULL
                END as approved_at,
                CASE 
                    WHEN bb.approval_rand < 0.70 THEN approver_employee_ids[floor(random() * array_length(approver_employee_ids, 1) + 1)]
                    ELSE NULL
                END as approved_by,
                -- Only set active if approved (same random value ensures consistency)
                bb.approval_rand < 0.70 as is_active,
                CASE 
                    WHEN bb.approval_rand < 0.70 THEN current_date - (random() * 15)::integer
                    ELSE NULL
                END as activated_at,
                jsonb_build_object(
                    'base_sqft_rate', ROUND((50 + random() * 100)::numeric, 2),
                    'condition_multiplier', ROUND((bb.condition_rating / 10.0)::numeric, 3),
                    'neighborhood_factor', ROUND((0.8 + random() * 0.4)::numeric, 3),
                    'calculation_date', current_date,
                    'depreciation_rate', ROUND((random() * 0.2)::numeric, 3)
                ) as calculation_metadata,
                '4be94f1c-078e-4810-8b6c-f2800a3c02f8'::uuid as created_by
            FROM building_batch bb
            ON CONFLICT (building_id, assessment_cycle_id, method_id, current_use_id) DO NOTHING
            RETURNING id, building_id, total_value, method_id
        )
        
        -- Generate value components for each building value
        INSERT INTO public.building_value_components_v2 (building_value_id, component_id, component_value, percentage_of_total)
        SELECT 
            vb.id as building_value_id,
            vc.id as component_id,
            ROUND((vb.total_value * (0.05 + random() * 0.25))::numeric, 2) as component_value,
            ROUND(((0.05 + random() * 0.25) * 100)::numeric, 2) as percentage_of_total
        FROM value_batch vb
        CROSS JOIN (
            SELECT id FROM public.value_components_v2 
            WHERE applies_to IN ('building', 'both') AND is_active = true
            ORDER BY random() 
            LIMIT 3  -- 3 components per building
        ) vc;
        
        current_batch := current_batch + 1;
        
        IF current_batch % 5 = 0 THEN
            RAISE NOTICE 'Generated % building values (% batches)', 
                current_batch * batch_size, current_batch;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Completed building value generation in %', now() - start_time;
END;
$$;

-- Generate land values for current assessment cycle  
DO $$
DECLARE
    value_count integer := 10000;
    batch_size integer := 500;
    current_batch integer := 0;
    start_time timestamp := now();
    current_cycle_id bigint;
    method_ids bigint[];
    approver_employee_ids bigint[];
BEGIN
    -- Get current assessment cycle
    SELECT id INTO current_cycle_id 
    FROM public.assessment_cycles_v2 
    WHERE is_active = true LIMIT 1;
    
    -- Get method IDs
    SELECT array_agg(id) INTO method_ids FROM public.valuation_methods_v2 WHERE is_active = true;
    
    -- Get employee IDs who can approve
    SELECT array_agg(id) INTO approver_employee_ids FROM public.employees_v2 WHERE can_approve = true;
    
    RAISE NOTICE 'Starting generation of % land values at %', value_count, start_time;
    
    WHILE current_batch * batch_size < value_count LOOP
        -- Generate land values
        WITH land_batch AS (
            SELECT id, parcel_id, area_sqft, best_use_id, random() as approval_rand
            FROM public.lands_v2 
            ORDER BY random()
            LIMIT batch_size
            OFFSET current_batch * batch_size
        ),
        value_batch AS (
            INSERT INTO public.land_values_v2 (
                land_id, assessment_cycle_id, method_id, 
                current_use_id, best_use_id, scheduled_calculation_date,
                calculation_trigger, status, total_value, 
                calculation_completed_at, approved_at, approved_by,
                is_active, activated_at, calculation_metadata, created_by
            )
            SELECT 
                lb.id as land_id,
                current_cycle_id as assessment_cycle_id,
                method_ids[floor(random() * array_length(method_ids, 1) + 1)] as method_id,
                lb.best_use_id as current_use_id,
                lb.best_use_id as best_use_id,
                current_date - (random() * 90)::integer as scheduled_calculation_date,
                CASE 
                    WHEN random() < 0.60 THEN 'immediate'
                    WHEN random() < 0.85 THEN 'next_cycle'
                    ELSE 'custom_date'
                END as calculation_trigger,
                CASE 
                    WHEN lb.approval_rand < 0.70 THEN 'approved'
                    WHEN lb.approval_rand < 0.85 THEN 'pending_approval'
                    WHEN lb.approval_rand < 0.95 THEN 'draft'
                    ELSE 'rejected'
                END as status,
                -- Base value on area and use type
                ROUND((lb.area_sqft * (5 + random() * 20))::numeric, 2) as total_value,
                current_date - (random() * 60)::integer as calculation_completed_at,
                CASE 
                    WHEN lb.approval_rand < 0.70 THEN current_date - (random() * 30)::integer
                    ELSE NULL
                END as approved_at,
                CASE 
                    WHEN lb.approval_rand < 0.70 THEN approver_employee_ids[floor(random() * array_length(approver_employee_ids, 1) + 1)]
                    ELSE NULL
                END as approved_by,
                lb.approval_rand < 0.70 as is_active,
                CASE 
                    WHEN lb.approval_rand < 0.70 THEN current_date - (random() * 15)::integer
                    ELSE NULL
                END as activated_at,
                jsonb_build_object(
                    'base_sqft_rate', ROUND((5 + random() * 20)::numeric, 2),
                    'use_multiplier', ROUND((0.8 + random() * 0.4)::numeric, 3),
                    'location_factor', ROUND((0.7 + random() * 0.6)::numeric, 3),
                    'calculation_date', current_date
                ) as calculation_metadata,
                '4be94f1c-078e-4810-8b6c-f2800a3c02f8'::uuid as created_by
            FROM land_batch lb
            ON CONFLICT (land_id, assessment_cycle_id, method_id, current_use_id) DO NOTHING
            RETURNING id, land_id, total_value
        )
        
        -- Generate land value components
        INSERT INTO public.land_value_components_v2 (land_value_id, component_id, component_value, percentage_of_total)
        SELECT 
            vb.id as land_value_id,
            vc.id as component_id,
            ROUND((vb.total_value * (0.1 + random() * 0.3))::numeric, 2) as component_value,
            ROUND(((0.1 + random() * 0.3) * 100)::numeric, 2) as percentage_of_total
        FROM value_batch vb
        CROSS JOIN (
            SELECT id FROM public.value_components_v2 
            WHERE applies_to IN ('land', 'both') AND is_active = true
            ORDER BY random() 
            LIMIT 2  -- 2 components per land value
        ) vc;
        
        current_batch := current_batch + 1;
        
        IF current_batch % 5 = 0 THEN
            RAISE NOTICE 'Generated % land values (% batches)', 
                current_batch * batch_size, current_batch;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Completed land value generation in %', now() - start_time;
END;
$$;

-- ============================================================
-- GENERATE MIXED-USE VALUE ALLOCATIONS
-- ============================================================

-- Generate value type allocations for mixed-use properties
DO $$
DECLARE
    allocation_count integer := 1000;  -- 1000 mixed-use allocations
    batch_size integer := 200;
    current_batch integer := 0;
    start_time timestamp := now();
    value_type_ids bigint[];
BEGIN
    -- Get value type IDs
    SELECT array_agg(id) INTO value_type_ids FROM public.value_types_v2 WHERE is_active = true;
    
    RAISE NOTICE 'Starting generation of % value type allocations at %', allocation_count, start_time;
    
    WHILE current_batch * batch_size < allocation_count LOOP
        -- Generate building value allocations
        INSERT INTO public.value_type_allocations_v2 (value_id, value_table, value_type_id, percentage_allocation)
        SELECT 
            bv.id as value_id,
            'building_values_v2' as value_table,
            value_type_ids[floor(random() * array_length(value_type_ids, 1) + 1)] as value_type_id,
            CASE 
                WHEN random() < 0.60 THEN 100.0  -- Single use
                WHEN random() < 0.80 THEN 70.0   -- Primary use 
                ELSE 30.0                        -- Secondary use
            END as percentage_allocation
        FROM (
            SELECT id FROM public.building_values_v2 
            WHERE is_active = true
            ORDER BY random()
            LIMIT batch_size
            OFFSET current_batch * batch_size
        ) bv
        ON CONFLICT (value_id, value_table, value_type_id) DO NOTHING;
        
        current_batch := current_batch + 1;
        
        IF current_batch % 2 = 0 THEN
            RAISE NOTICE 'Generated % value allocations (% batches)', 
                current_batch * batch_size, current_batch;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Completed value allocation generation in %', now() - start_time;
END;
$$;

-- ============================================================
-- GENERATE SALES, PERMITS, APPEALS, AND REVIEWS (same as before)
-- ============================================================

-- Generate sales, permits, appeals, and reviews (abbreviated for performance)
DO $$
DECLARE
    sale_count integer := 3000;
    batch_size integer := 500;
    current_batch integer := 0;
    start_time timestamp := now();
BEGIN
    RAISE NOTICE 'Starting generation of % sales at %', sale_count, start_time;
    
    -- Generate simple sales without complex parcels relationships for performance
    INSERT INTO public.sales_v2 (
        sale_date, sale_price, grantor, grantee, 
        sale_type, is_valid, sale_data
    )
    SELECT 
        (CURRENT_DATE - (random() * 1000)::integer) as sale_date,
        floor(random() * 400000) + 50000 as sale_price,
        random_owner_name() as grantor,
        random_owner_name() as grantee,
        CASE 
            WHEN random() < 0.90 THEN 'arms_length'
            ELSE 'family_transfer'
        END as sale_type,
        random() < 0.95 as is_valid,
        jsonb_build_object(
            'deed_book', floor(random() * 500) + 1000,
            'deed_page', floor(random() * 200) + 1
        ) as sale_data
    FROM generate_series(1, sale_count);
    
    -- Generate simple sales_parcels relationships
    INSERT INTO public.sales_parcels_v2 (sale_id, parcel_id, allocated_price, percentage)
    SELECT 
        s.id,
        p.id,
        s.sale_price,
        100.0
    FROM public.sales_v2 s
    CROSS JOIN LATERAL (
        SELECT id FROM public.parcels_v2 ORDER BY random() LIMIT 1
    ) p;
    
    RAISE NOTICE 'Completed simplified sales generation in %', now() - start_time;
END;
$$;

-- Generate permits
DO $$
DECLARE
    permit_count integer := 2000;
    start_time timestamp := now();
BEGIN
    RAISE NOTICE 'Starting generation of % permits at %', permit_count, start_time;
    
    INSERT INTO public.permits_v2 (
        parcel_id, permit_number, permit_type, issued_date,
        permit_value, work_description
    )
    SELECT 
        p.id as parcel_id,
        'P' || LPAD((row_number() OVER ())::text, 6, '0') as permit_number,
        CASE 
            WHEN random() < 0.40 THEN 'building'
            WHEN random() < 0.60 THEN 'renovation'
            WHEN random() < 0.75 THEN 'electrical'
            WHEN random() < 0.85 THEN 'plumbing'
            ELSE 'roofing'
        END as permit_type,
        CASE 
            WHEN random() < 0.80 THEN (CURRENT_DATE - (random() * 500)::integer)
            ELSE NULL  -- 20% pending permits
        END as issued_date,
        floor(random() * 50000) + 1000 as permit_value,
        CASE 
            WHEN random() < 0.30 THEN 'Kitchen renovation'
            WHEN random() < 0.50 THEN 'Bathroom remodel'
            WHEN random() < 0.70 THEN 'Roof replacement'
            WHEN random() < 0.85 THEN 'HVAC installation'
            ELSE 'Electrical upgrade'
        END as work_description
    FROM (
        SELECT id FROM public.parcels_v2 ORDER BY random() LIMIT permit_count
    ) p;
    
    RAISE NOTICE 'Completed permits generation in %', now() - start_time;
END;
$$;

-- Generate appeals
DO $$
DECLARE
    appeal_count integer := 500;
    start_time timestamp := now();
BEGIN
    RAISE NOTICE 'Starting generation of % appeals at %', appeal_count, start_time;
    
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
            WHEN random() < 0.85 THEN 'informal'
            WHEN random() < 0.98 THEN 'formal'
            ELSE 'board'
        END as appeal_level,
        p.owner_name as appellant_name,
        oa.street_address || COALESCE(', ' || oa.city, '') as appellant_address,
        CASE 
            WHEN random() < 0.60 THEN 'overvaluation'
            WHEN random() < 0.80 THEN 'property_damage'
            WHEN random() < 0.90 THEN 'incorrect_classification'
            ELSE 'exemption_eligibility'
        END as reason_for_appeal,
        floor(random() * 300000) + 100000 as current_assessment,
        floor(random() * 250000) + 50000 as requested_assessment
    FROM (
        SELECT p.id, p.owner_name, p.owner_address_id
        FROM public.parcels_v2 p ORDER BY random() LIMIT appeal_count
    ) p
    LEFT JOIN public.addresses_v2 oa ON p.owner_address_id = oa.id;
    
    RAISE NOTICE 'Completed appeals generation in %', now() - start_time;
END;
$$;

-- Generate reviews
DO $$
DECLARE
    review_count integer := 1500;
    start_time timestamp := now();
    employee_ids bigint[];
BEGIN
    -- Get employee IDs for assignment
    SELECT array_agg(id) INTO employee_ids FROM public.employees_v2;
    
    RAISE NOTICE 'Starting generation of % reviews at %', review_count, start_time;
    
    -- Generate parcel reviews
    INSERT INTO public.reviews_v2 (
        kind, title, current_status_id, assigned_to_id, data, created_by
    )
    SELECT 
        CASE 
            WHEN random() < 0.30 THEN 'parcel_review'::review_kind_v2
            WHEN random() < 0.50 THEN 'building_review'::review_kind_v2
            WHEN random() < 0.65 THEN 'land_review'::review_kind_v2
            WHEN random() < 0.75 THEN 'building_valuation'::review_kind_v2
            WHEN random() < 0.85 THEN 'land_valuation'::review_kind_v2
            WHEN random() < 0.92 THEN 'value_calculation'::review_kind_v2
            WHEN random() < 0.96 THEN 'sale_review'::review_kind_v2
            WHEN random() < 0.98 THEN 'permit_review'::review_kind_v2
            ELSE 'appeal_review'::review_kind_v2
        END as kind,
        CASE 
            WHEN random() < 0.50 THEN 'Assessment Review - ' || p.parcel_number
            WHEN random() < 0.75 THEN 'Property Inspection - ' || p.parcel_number
            ELSE 'Value Review - ' || p.parcel_number
        END as title,
        rs.id as current_status_id,
        employee_ids[floor(random() * array_length(employee_ids, 1) + 1)] as assigned_to_id,
        jsonb_build_object(
            'parcel_id', p.id,
            'review_reason', CASE 
                WHEN random() < 0.40 THEN 'routine_inspection'
                WHEN random() < 0.65 THEN 'ownership_change'
                WHEN random() < 0.80 THEN 'value_appeal'
                ELSE 'data_correction'
            END
        ) as data,
        '4be94f1c-078e-4810-8b6c-f2800a3c02f8'::uuid as created_by
    FROM (
        SELECT id, parcel_number, owner_name FROM public.parcels_v2 ORDER BY random() LIMIT review_count
    ) p
    CROSS JOIN LATERAL (
        SELECT id FROM public.review_statuses_v2 
        WHERE review_kind = 'parcel_review' 
        ORDER BY random() LIMIT 1
    ) rs;
    
    RAISE NOTICE 'Completed reviews generation in %', now() - start_time;
END;
$$;

-- Generate permits, appeals, and reviews (abbreviated for performance)
-- [Additional sections would continue with permits, appeals, reviews, and snapshots generation]
-- Commented out for faster seed generation - add back if needed

-- ============================================================
-- GENERATE HISTORICAL SNAPSHOTS AND REVIEW HISTORY
-- ============================================================

-- Generate parcel snapshots
DO $$
DECLARE
    snapshot_count integer := 2000;
    start_time timestamp := now();
    review_ids bigint[];
BEGIN
    -- Get existing review IDs for linking snapshots
    SELECT array_agg(id) INTO review_ids FROM public.reviews_v2 LIMIT 1000;
    
    RAISE NOTICE 'Starting generation of % parcel snapshots at %', snapshot_count, start_time;
    
    INSERT INTO public.parcel_snapshots_v2 (
        parcel_id, review_id, snapshot_date, block, lot, ext, parcel_number,
        tax_status_id, property_class, owner_name, owner_address_id,
        site_address_id, neighborhood_id, parcel_data, created_by
    )
    SELECT 
        p.id as parcel_id,
        CASE 
            WHEN array_length(review_ids, 1) > 0 THEN review_ids[floor(random() * array_length(review_ids, 1) + 1)]
            ELSE NULL
        END as review_id,
        (CURRENT_DATE - (random() * 800)::integer) as snapshot_date,
        p.block, p.lot, p.ext, p.parcel_number, p.tax_status_id, p.property_class,
        p.owner_name, p.owner_address_id, p.site_address_id, p.neighborhood_id,
        jsonb_build_object(
            'snapshot_reason', CASE 
                WHEN random() < 0.40 THEN 'assessment_update'
                WHEN random() < 0.70 THEN 'ownership_change'
                ELSE 'routine_review'
            END,
            'assessed_value', floor(random() * 200000) + 50000
        ) as parcel_data,
        '4be94f1c-078e-4810-8b6c-f2800a3c02f8'::uuid as created_by
    FROM (
        SELECT * FROM public.parcels_v2 ORDER BY random() LIMIT snapshot_count
    ) p;
    
    RAISE NOTICE 'Completed parcel snapshots generation in %', now() - start_time;
END;
$$;

-- Generate building snapshots
DO $$
DECLARE
    snapshot_count integer := 1500;
    start_time timestamp := now();
    review_ids bigint[];
BEGIN
    -- Get building review IDs specifically
    SELECT array_agg(id) INTO review_ids 
    FROM public.reviews_v2 
    WHERE kind IN ('building_review', 'building_valuation');
    
    RAISE NOTICE 'Starting generation of % building snapshots at %', snapshot_count, start_time;
    
    INSERT INTO public.building_snapshots_v2 (
        building_id, review_id, snapshot_date, year_built, square_footage,
        finished_area, bedrooms, bathrooms, condition_rating,
        building_type, building_data
    )
    SELECT 
        b.id as building_id,
        CASE 
            WHEN array_length(review_ids, 1) > 0 THEN review_ids[floor(random() * array_length(review_ids, 1) + 1)]
            ELSE NULL
        END as review_id,
        (CURRENT_DATE - (random() * 600)::integer) as snapshot_date,
        b.year_built, b.square_footage, b.finished_area, b.bedrooms, 
        b.bathrooms, b.condition_rating, b.building_type,
        jsonb_build_object(
            'inspection_type', 'routine',
            'inspector_notes', 'Historical condition assessment',
            'total_value', floor(random() * 300000) + 100000,
            'method', 'cost_approach'
        ) as building_data
    FROM (
        SELECT * FROM public.buildings_v2 ORDER BY random() LIMIT snapshot_count
    ) b;
    
    RAISE NOTICE 'Completed building snapshots generation in %', now() - start_time;
END;
$$;

-- Generate land snapshots
DO $$
DECLARE
    snapshot_count integer := 1500;
    start_time timestamp := now();
    review_ids bigint[];
BEGIN
    -- Get land review IDs specifically
    SELECT array_agg(id) INTO review_ids 
    FROM public.reviews_v2 
    WHERE kind IN ('land_review', 'land_valuation');
    
    RAISE NOTICE 'Starting generation of % land snapshots at %', snapshot_count, start_time;
    
    INSERT INTO public.land_snapshots_v2 (
        land_id, review_id, snapshot_date, area_sqft, frontage_ft,
        depth_ft, land_use, topography, land_data
    )
    SELECT 
        l.id as land_id,
        CASE 
            WHEN array_length(review_ids, 1) > 0 THEN review_ids[floor(random() * array_length(review_ids, 1) + 1)]
            ELSE NULL
        END as review_id,
        (CURRENT_DATE - (random() * 500)::integer) as snapshot_date,
        l.area_sqft, l.frontage_ft, l.depth_ft, l.land_use, l.topography,
        jsonb_build_object(
            'survey_type', 'boundary_verification',
            'land_value_sqft', ROUND((random() * 30 + 10)::numeric, 2),
            'total_value', floor(random() * 150000) + 25000,
            'method', 'sales_comparison'
        ) as land_data
    FROM (
        SELECT * FROM public.lands_v2 ORDER BY random() LIMIT snapshot_count
    ) l;
    
    RAISE NOTICE 'Completed land snapshots generation in %', now() - start_time;
END;
$$;

-- Generate review history (status changes)
DO $$
DECLARE
    history_count integer := 3000;
    start_time timestamp := now();
    review_ids bigint[];
    status_ids bigint[];
BEGIN
    SELECT array_agg(id) INTO review_ids FROM public.reviews_v2;
    SELECT array_agg(id) INTO status_ids FROM public.review_statuses_v2;
    
    RAISE NOTICE 'Starting generation of % review history entries at %', history_count, start_time;
    
    INSERT INTO public.review_history_v2 (
        review_id, changed_by, note, changed_at, status_id
    )
    SELECT 
        review_ids[floor(random() * array_length(review_ids, 1) + 1)] as review_id,
        '4be94f1c-078e-4810-8b6c-f2800a3c02f8'::uuid as changed_by,
        CASE 
            WHEN random() < 0.30 THEN 'Status updated by system'
            WHEN random() < 0.60 THEN 'Approved by supervisor'
            WHEN random() < 0.80 THEN 'Additional information required'
            ELSE 'Review completed'
        END as notes,
        (CURRENT_DATE - (random() * 365)::integer + time '00:00:00' + random() * interval '24 hours') as changed_at,
        status_ids[floor(random() * array_length(status_ids, 1) + 1)] as status_id
    FROM generate_series(1, history_count);
    
    RAISE NOTICE 'Completed review history generation in %', now() - start_time;
END;
$$;

-- ============================================================
-- PERFORMANCE OPTIMIZATION
-- ============================================================

-- Analyze tables for better query performance
ANALYZE public.parcels_v2;
ANALYZE public.buildings_v2;
ANALYZE public.lands_v2;
ANALYZE public.building_current_uses_v2;
ANALYZE public.land_current_uses_v2;
ANALYZE public.building_values_v2;
ANALYZE public.land_values_v2;
ANALYZE public.reviews_v2;
ANALYZE public.permits_v2;
ANALYZE public.appeals_v2;
ANALYZE public.parcel_snapshots_v2;
ANALYZE public.building_snapshots_v2;
ANALYZE public.land_snapshots_v2;
ANALYZE public.review_history_v2;

-- ============================================================
-- CLEANUP
-- ============================================================

-- Drop temporary functions
DROP FUNCTION IF EXISTS random_owner_name();
DROP FUNCTION IF EXISTS random_street_name();
DROP FUNCTION IF EXISTS random_use_by_category(text);

-- ============================================================
-- SUMMARY REPORT
-- ============================================================

DO $$
DECLARE
    -- Core data counts
    parcel_count bigint;
    building_count bigint;
    land_count bigint;
    employee_count bigint;
    neighborhood_count bigint;
    
    -- Use and value counts  
    building_use_count bigint;
    land_use_count bigint;
    building_value_count bigint;
    land_value_count bigint;
    component_count bigint;
    allocation_count bigint;
    
    -- Transaction counts
    sale_count bigint;
    permit_count bigint;
    appeal_count bigint;
    review_count bigint;
    
    -- Snapshot and history counts
    parcel_snapshot_count bigint;
    building_snapshot_count bigint;
    land_snapshot_count bigint;
    review_history_count bigint;
    
    -- Lookup table counts
    assessment_cycle_count bigint;
    property_use_count bigint;
    valuation_method_count bigint;
    value_type_count bigint;
    value_component_count bigint;
    address_count bigint;
    tax_status_count bigint;
BEGIN
    -- Get all counts
    SELECT count(*) INTO parcel_count FROM public.parcels_v2;
    SELECT count(*) INTO building_count FROM public.buildings_v2;
    SELECT count(*) INTO land_count FROM public.lands_v2;
    SELECT count(*) INTO employee_count FROM public.employees_v2;
    SELECT count(*) INTO neighborhood_count FROM public.neighborhoods_v2;
    
    SELECT count(*) INTO building_use_count FROM public.building_current_uses_v2;
    SELECT count(*) INTO land_use_count FROM public.land_current_uses_v2;
    SELECT count(*) INTO building_value_count FROM public.building_values_v2;
    SELECT count(*) INTO land_value_count FROM public.land_values_v2;
    SELECT count(*) INTO component_count FROM public.building_value_components_v2;
    SELECT count(*) INTO allocation_count FROM public.value_type_allocations_v2;
    
    SELECT count(*) INTO sale_count FROM public.sales_v2;
    SELECT count(*) INTO permit_count FROM public.permits_v2;
    SELECT count(*) INTO appeal_count FROM public.appeals_v2;
    SELECT count(*) INTO review_count FROM public.reviews_v2;
    
    SELECT count(*) INTO parcel_snapshot_count FROM public.parcel_snapshots_v2;
    SELECT count(*) INTO building_snapshot_count FROM public.building_snapshots_v2;
    SELECT count(*) INTO land_snapshot_count FROM public.land_snapshots_v2;
    SELECT count(*) INTO review_history_count FROM public.review_history_v2;
    
    SELECT count(*) INTO assessment_cycle_count FROM public.assessment_cycles_v2;
    SELECT count(*) INTO property_use_count FROM public.property_uses_v2;
    SELECT count(*) INTO valuation_method_count FROM public.valuation_methods_v2;
    SELECT count(*) INTO value_type_count FROM public.value_types_v2;
    SELECT count(*) INTO value_component_count FROM public.value_components_v2;
    SELECT count(*) INTO address_count FROM public.addresses_v2;
    SELECT count(*) INTO tax_status_count FROM public.tax_statuses_v2;
    
    RAISE NOTICE '============================================================';
    RAISE NOTICE 'SEED-V3 DATA GENERATION COMPLETE - ALL TABLES POPULATED';
    RAISE NOTICE '============================================================';
    
    RAISE NOTICE 'LOOKUP TABLES:';
    RAISE NOTICE '  Employees:             %', employee_count;
    RAISE NOTICE '  Neighborhoods:         %', neighborhood_count;
    RAISE NOTICE '  Tax Statuses:          %', tax_status_count;
    RAISE NOTICE '  Addresses:             %', address_count;
    RAISE NOTICE '  Assessment Cycles:     %', assessment_cycle_count;
    RAISE NOTICE '  Property Uses:         %', property_use_count;
    RAISE NOTICE '  Valuation Methods:     %', valuation_method_count;
    RAISE NOTICE '  Value Types:           %', value_type_count;
    RAISE NOTICE '  Value Components:      %', value_component_count;
    RAISE NOTICE '';
    
    RAISE NOTICE 'CORE PROPERTY DATA:';
    RAISE NOTICE '  Parcels:               %', parcel_count;
    RAISE NOTICE '  Buildings:             %', building_count;
    RAISE NOTICE '  Lands:                 %', land_count;
    RAISE NOTICE '';
    
    RAISE NOTICE 'USE MANAGEMENT:';
    RAISE NOTICE '  Building Current Uses: %', building_use_count;
    RAISE NOTICE '  Land Current Uses:     %', land_use_count;
    RAISE NOTICE '';
    
    RAISE NOTICE 'VALUE MANAGEMENT:';
    RAISE NOTICE '  Building Values:       %', building_value_count;
    RAISE NOTICE '  Land Values:           %', land_value_count;
    RAISE NOTICE '  Value Components:      %', component_count;
    RAISE NOTICE '  Value Allocations:     %', allocation_count;
    RAISE NOTICE '';
    
    RAISE NOTICE 'TRANSACTIONS & WORKFLOWS:';
    RAISE NOTICE '  Sales:                 %', sale_count;
    RAISE NOTICE '  Permits:               %', permit_count;
    RAISE NOTICE '  Appeals:               %', appeal_count;
    RAISE NOTICE '  Reviews:               %', review_count;
    RAISE NOTICE '';
    
    RAISE NOTICE 'HISTORICAL TRACKING:';
    RAISE NOTICE '  Parcel Snapshots:      %', parcel_snapshot_count;
    RAISE NOTICE '  Building Snapshots:    %', building_snapshot_count;
    RAISE NOTICE '  Land Snapshots:        %', land_snapshot_count;
    RAISE NOTICE '  Review History:        %', review_history_count;
    RAISE NOTICE '';
    
    RAISE NOTICE '============================================================';
    RAISE NOTICE 'ALL % SCHEMA TABLES NOW CONTAIN TEST DATA!', 29;
    RAISE NOTICE 'Complete value and use management system ready for testing.';
    RAISE NOTICE '============================================================';
END;
$$;

-- ============================================================
-- END SEED-V3.SQL
-- ============================================================