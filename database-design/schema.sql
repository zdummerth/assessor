drop table if exists parcels cascade;

drop table if exists parcel_relationships cascade;

drop table if exists buildings cascade;

drop table if exists building_sections cascade;

drop table if exists building_section_parcels cascade;

drop table if exists building_section_status cascade;

drop table if exists building_section_conditions cascade;

drop table if exists addresses cascade;

drop table if exists parcel_addresses cascade;

drop table if exists building_addresses cascade;

drop table if exists owners cascade;

drop table if exists owner_addresses cascade;

drop table if exists parcel_ownerships cascade;

drop table if exists parcel_values cascade;

drop table if exists parcel_value_status cascade;

drop table if exists parcel_value_cost cascade;

drop table if exists parcel_value_sales_comparables cascade;

drop table if exists parcel_value_appeal cascade;

drop table if exists parcel_value_sales_model cascade;

drop table if exists parcel_value_income cascade;

drop table if exists sales cascade;

drop table if exists sale_status cascade;

drop table if exists sales_parcel cascade;

drop table if exists sale_parcel_buyers cascade;

drop table if exists sale_parcel_sellers cascade;

drop table if exists sale_building_sections cascade;

drop table if exists parcel_values_sales_comparables_sales cascade;

drop table if exists tax_rates cascade;

drop table if exists tax_rate_years cascade;

drop table if exists parcel_tax_rates cascade;

drop table if exists employees cascade;

drop table if exists parcel_assignments cascade;

drop table if exists attachments cascade;

drop table if exists parcel_attachments cascade;

drop table if exists sales_attachments cascade;

drop table if exists appeal_attachments cascade;

-- 1. Parcels
CREATE TABLE
    parcels (
        id SERIAL PRIMARY KEY,
        parcel_number TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT now (),
        retired_at TIMESTAMP DEFAULT NULL -- Timestamp when the parcel was retired
    );

-- Create table so parcels can be self referential
CREATE TABLE
    parcel_relationships (
        id SERIAL PRIMARY KEY,
        parent_parcel_id INTEGER REFERENCES parcels (id) ON DELETE CASCADE,
        child_parcel_id INTEGER REFERENCES parcels (id) ON DELETE CASCADE,
        relationship_type TEXT NOT NULL CHECK (relationship_type IN ('split', 'merge')),
        created_at TIMESTAMP DEFAULT now (),
        UNIQUE (
            parent_parcel_id,
            child_parcel_id,
            relationship_type
        )
    );

CREATE TABLE
    attributes (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT
    );

CREATE TABLE
    parcel_attributes (
        id SERIAL PRIMARY KEY,
        parcel_id INTEGER NOT NULL REFERENCES parcels (id) ON DELETE CASCADE,
        attribute_id INTEGER NOT NULL REFERENCES attributes (id) ON DELETE CASCADE,
        value TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT now (),
        UNIQUE (parcel_id, attribute_id)
    )
    -- 2. Buildings & Sections
CREATE TABLE
    buildings (
        id SERIAL PRIMARY KEY,
        name TEXT,
        construction_start_date DATE,
        created_at TIMESTAMP DEFAULT now ()
    );

CREATE TABLE
    building_sections (
        id SERIAL PRIMARY KEY, -- <== add a primary key
        building_id INTEGER NOT NULL REFERENCES buildings (id) ON DELETE CASCADE,
        unit_number TEXT,
        floor INTEGER,
        finished_area INTEGER,
        unfinished_area INTEGER,
        total_area INTEGER GENERATED ALWAYS AS (finished_area + unfinished_area) STORED,
        construction_start_date DATE,
        construction_completion_date DATE,
        demolition_date DATE,
        created_at TIMESTAMP DEFAULT now ()
    );

CREATE TABLE
    building_section_parcels (
        id SERIAL PRIMARY KEY,
        parcel_id INTEGER NOT NULL REFERENCES parcels (id) ON DELETE CASCADE,
        building_section_id INTEGER NOT NULL REFERENCES building_sections (id) ON DELETE CASCADE,
        start_date DATE NOT NULL, -- Start date of the association between parcel and building section
        end_date DATE, -- End date of the association (NULL if current)
        is_primary BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT now (),
        CONSTRAINT one_primary_per_parcel UNIQUE (parcel_id, is_primary) DEFERRABLE INITIALLY IMMEDIATE
    );

CREATE TABLE
    building_section_status (
        id SERIAL PRIMARY KEY,
        building_section_parcel_id INTEGER NOT NULL REFERENCES building_sections (id) ON DELETE CASCADE,
        status TEXT NOT NULL CHECK (
            status IN (
                'active',
                'inactive',
                'demolished',
                'under_construction'
            )
        ),
        effective_date DATE NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT now ()
    );

CREATE TABLE
    building_section_conditions (
        id SERIAL PRIMARY KEY,
        building_section_parcel_id INTEGER NOT NULL REFERENCES building_section_parcels (id) ON DELETE CASCADE,
        effective_date DATE NOT NULL,
        condition INTEGER NOT NULL CHECK (condition BETWEEN 0 AND 100),
        notes TEXT,
        created_at TIMESTAMP DEFAULT now ()
    );

-- 3. Addresses
-- create mailing address table where it could be a site address or custo address
CREATE TABLE
    addresses (
        id SERIAL PRIMARY KEY,
        house_number TEXT NOT NULL,
        prefix TEXT,
        suffix TEXT,
        direction TEXT CHECK (
            direction IN ('N', 'S', 'E', 'W', 'NE', 'NW', 'SE', 'SW')
        ),
        street TEXT NOT NULL,
        city TEXT NOT NULL DEFAULT 'St. Louis',
        state TEXT NOT NULL DEFAULT 'MO',
        zip_code TEXT,
        unit TEXT,
        full_address TEXT GENERATED ALWAYS AS (
            street || COALESCE(' ' || unit, '') || ', ' || city || ', ' || state || ' ' || COALESCE(zip_code, '')
        ) STORED,
        latitude NUMERIC(9, 6),
        longitude NUMERIC(9, 6),
        created_at TIMESTAMP DEFAULT now ()
    );

CREATE TABLE
    parcel_addresses (
        id SERIAL PRIMARY KEY,
        parcel_id INTEGER NOT NULL REFERENCES parcels (id) ON DELETE CASCADE,
        address_id INTEGER NOT NULL REFERENCES addresses (id) ON DELETE CASCADE,
        start_date DATE NOT NULL,
        end_date DATE,
        is_primary BOOLEAN DEFAULT FALSE,
        CONSTRAINT one_primary_parcel_addresses_per_parcel UNIQUE (parcel_id, is_primary) DEFERRABLE INITIALLY IMMEDIATE
    );

CREATE TABLE
    building_addresses (
        id SERIAL PRIMARY KEY,
        building_id INTEGER NOT NULL REFERENCES buildings (id) ON DELETE CASCADE,
        address_id INTEGER NOT NULL REFERENCES addresses (id) ON DELETE CASCADE,
        start_date DATE NOT NULL,
        end_date DATE,
        is_primary BOOLEAN DEFAULT FALSE,
        CONSTRAINT one_primary_per_building UNIQUE (building_id, is_primary) DEFERRABLE INITIALLY IMMEDIATE
    );

-- 4. Ownership Tracking
CREATE TABLE
    owners (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        tax_id TEXT,
        created_at TIMESTAMP DEFAULT now ()
    );

CREATE TABLE
    owner_addresses (
        id SERIAL PRIMARY KEY,
        owner_id INTEGER NOT NULL REFERENCES owners (id) ON DELETE CASCADE,
        address_id INTEGER NOT NULL REFERENCES addresses (id) ON DELETE CASCADE,
        start_date DATE NOT NULL,
        end_date DATE,
        is_primary BOOLEAN DEFAULT TRUE,
        CONSTRAINT one_primary_per_owner UNIQUE (owner_id, is_primary) DEFERRABLE INITIALLY IMMEDIATE
    );

CREATE TABLE
    parcel_ownerships (
        id SERIAL PRIMARY KEY,
        parcel_id INTEGER NOT NULL REFERENCES parcels (id) ON DELETE CASCADE,
        owner_id INTEGER NOT NULL REFERENCES owners (id) ON DELETE CASCADE,
        start_date DATE NOT NULL,
        end_date DATE,
        ownership_type TEXT,
        is_primary BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT now ()
    );

-- 5. Parcel Values
CREATE TABLE
    parcel_values (
        id SERIAL PRIMARY KEY,
        parcel_id INTEGER NOT NULL REFERENCES parcels (id) ON DELETE CASCADE,
        tax_year INTEGER NOT NULL,
        value_type TEXT NOT NULL CHECK (
            value_type IN (
                'cost',
                'sales_model',
                'income',
                'sales_comparables',
                'appeal',
                'custom'
            )
        ),
        created_at TIMESTAMP DEFAULT now ()
    );

CREATE TABLE
    parcel_value_status (
        id SERIAL PRIMARY KEY,
        parcel_value_id INTEGER NOT NULL REFERENCES parcel_values (id) ON DELETE CASCADE,
        status TEXT NOT NULL CHECK (
            status IN (
                'draft',
                'approved',
                'rejected',
                'under_review',
                'made_in_error'
            )
        ),
        effective_date DATE NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT now ()
    );

CREATE TABLE
    parcel_value_cost (
        id INTEGER PRIMARY KEY REFERENCES parcel_values (id) ON DELETE CASCADE,
        land_value INTEGER,
        building_value INTEGER,
        depreciation_amount INTEGER,
        total_value INTEGER
    );

CREATE TABLE
    parcel_value_sales_comparables (
        id INTEGER PRIMARY KEY REFERENCES parcel_values (id) ON DELETE CASCADE,
        comparable_sales_count INTEGER,
        adjusted_average_price INTEGER,
        adjustments TEXT,
        total_value INTEGER
    );

CREATE TABLE
    parcel_value_appeal (
        id INTEGER PRIMARY KEY REFERENCES parcel_values (id) ON DELETE CASCADE,
        appeal_number TEXT,
        decision_date DATE,
        final_value INTEGER,
        notes TEXT
    );

CREATE TABLE
    parcel_value_sales_model (
        id INTEGER PRIMARY KEY REFERENCES parcel_values (id) ON DELETE CASCADE,
        model_id INTEGER NOT NULL,
        predicted_value NUMERIC(12, 2) NOT NULL,
        prediction_date DATE DEFAULT CURRENT_DATE
    );

CREATE TABLE
    parcel_value_income (
        id INTEGER PRIMARY KEY REFERENCES parcel_values (id) ON DELETE CASCADE,
        gross_income NUMERIC(15, 2),
        operating_expenses NUMERIC(15, 2),
        net_operating_income NUMERIC(15, 2),
        capitalization_rate NUMERIC(5, 4),
        total_value NUMERIC(15, 2)
    );

-- 7. Sales
CREATE TABLE
    sales (
        id SERIAL PRIMARY KEY,
        date_of_sale DATE,
        net_selling_price NUMERIC(15, 2),
        report_date DATE
    );

CREATE TABLE
    sale_status (
        id SERIAL PRIMARY KEY,
        sale_id INTEGER NOT NULL REFERENCES sales (id) ON DELETE CASCADE,
        sale_type TEXT NOT NULL CHECK (
            sale_type IN (
                'under_contract',
                'arms_length',
                'non_arms_length',
                'foreclosure',
                'gift',
                'other'
            )
        ),
        description TEXT,
        effective_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT now ()
    );

CREATE TABLE
    sales_parcel (
        id SERIAL PRIMARY KEY,
        sale_id INTEGER NOT NULL REFERENCES sales (id) ON DELETE CASCADE,
        parcel_id INTEGER NOT NULL REFERENCES parcels (id) ON DELETE CASCADE,
        percent_transferred NUMERIC(5, 2) DEFAULT 100.0,
        is_primary BOOLEAN DEFAULT FALSE
    );

CREATE TABLE
    sale_parcel_buyers (
        id SERIAL PRIMARY KEY,
        sale_id INTEGER NOT NULL REFERENCES sales (id) ON DELETE CASCADE,
        parcel_id INTEGER NOT NULL REFERENCES parcels (id) ON DELETE CASCADE,
        buyer_name TEXT NOT NULL,
        buyer_type TEXT CHECK (
            buyer_type IN (
                'individual',
                'corporation',
                'trust',
                'partnership',
                'other'
            )
        ),
        created_at TIMESTAMP DEFAULT now ()
    );

CREATE TABLE
    sale_parcel_sellers (
        id SERIAL PRIMARY KEY,
        sale_id INTEGER NOT NULL REFERENCES sales (id) ON DELETE CASCADE,
        parcel_id INTEGER NOT NULL REFERENCES parcels (id) ON DELETE CASCADE,
        seller_name TEXT NOT NULL,
        seller_type TEXT CHECK (
            seller_type IN (
                'individual',
                'corporation',
                'trust',
                'partnership',
                'other'
            )
        ),
        created_at TIMESTAMP DEFAULT now ()
    );

CREATE TABLE
    sale_building_sections (
        id SERIAL PRIMARY KEY,
        sale_id INTEGER NOT NULL REFERENCES sales (id) ON DELETE CASCADE,
        building_section_parcel_id INTEGER NOT NULL REFERENCES building_sections (id) ON DELETE CASCADE,
        condition_at_sale INTEGER CHECK (condition_at_sale BETWEEN 0 AND 100),
        notes TEXT,
        created_at TIMESTAMP DEFAULT now ()
    );

CREATE TABLE
    parcel_values_sales_comparables_sales (
        id SERIAL PRIMARY KEY,
        parcel_value_sales_comparable_id INTEGER NOT NULL REFERENCES parcel_value_sales_comparables (id) ON DELETE CASCADE,
        sale_id INTEGER NOT NULL REFERENCES sales (id) ON DELETE CASCADE,
        sale_price NUMERIC(15, 2),
        adjustment_amount NUMERIC(15, 2),
        notes TEXT
    );

-- 8. Tax Rates & Billing
CREATE TABLE
    tax_rates (
        id SERIAL PRIMARY KEY,
        code TEXT UNIQUE NOT NULL,
        description TEXT
    );

CREATE TABLE
    tax_rate_years (
        id SERIAL PRIMARY KEY,
        tax_rate_id INTEGER NOT NULL REFERENCES tax_rates (id) ON DELETE CASCADE,
        tax_year INTEGER NOT NULL,
        rate NUMERIC(8, 6) NOT NULL,
        rate_type TEXT NOT NULL CHECK (rate_type IN ('percentage', 'fixed')),
        cap NUMERIC(12, 2),
        created_at TIMESTAMP DEFAULT now (),
        UNIQUE (tax_rate_id, tax_year)
    );

CREATE TABLE
    parcel_tax_rates (
        id SERIAL PRIMARY KEY,
        parcel_id INTEGER NOT NULL REFERENCES parcels (id) ON DELETE CASCADE,
        rate_year_id INTEGER NOT NULL REFERENCES tax_rate_years (id) ON DELETE CASCADE,
        UNIQUE (parcel_id, rate_year_id)
    );

CREATE TABLE
    tax_bills (
        id SERIAL PRIMARY KEY,
        parcel_id INTEGER NOT NULL REFERENCES parcels (id) ON DELETE CASCADE,
        parcel_value_id INTEGER NOT NULL REFERENCES parcel_values (id) ON DELETE CASCADE,
        tax_year INTEGER NOT NULL,
        total_amount NUMERIC(15, 2) NOT NULL,
        due_date DATE NOT NULL,
        paid BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT now (),
        UNIQUE (parcel_id, tax_year)
    );

CREATE TABLE
    tax_bill_status (
        id SERIAL PRIMARY KEY,
        tax_bill_id INTEGER NOT NULL REFERENCES tax_bills (id) ON DELETE CASCADE,
        status TEXT NOT NULL CHECK (
            status IN (
                'draft',
                'issued',
                'paid',
                'delinquent',
                'cancelled'
            )
        ),
        effective_date DATE NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT now ()
    );

-- 9. Employees & Appraisers
CREATE TABLE
    employees (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        role TEXT CHECK (
            role IN ('appraiser', 'clerk', 'supervisor', 'admin')
        ) DEFAULT 'appraiser',
        active BOOLEAN DEFAULT TRUE
    );

CREATE TABLE
    parcel_assignments (
        id SERIAL PRIMARY KEY,
        parcel_id INTEGER NOT NULL REFERENCES parcels (id) ON DELETE CASCADE,
        year INTEGER NOT NULL,
        employee_id INTEGER NOT NULL REFERENCES employees (id) ON DELETE CASCADE,
        assigned_at TIMESTAMP DEFAULT now (),
        notes TEXT,
        UNIQUE (parcel_id, year)
    );

-- 10. Attachments
CREATE TABLE
    attachments (
        id SERIAL PRIMARY KEY,
        file_name TEXT NOT NULL,
        file_url TEXT NOT NULL,
        file_type TEXT,
        file_size INTEGER,
        uploaded_at TIMESTAMP DEFAULT now (),
        description TEXT,
        uploaded_by INTEGER REFERENCES employees (id)
    );

CREATE TABLE
    parcel_attachments (
        id SERIAL PRIMARY KEY,
        parcel_id INTEGER NOT NULL REFERENCES parcels (id) ON DELETE CASCADE,
        attachment_id INTEGER NOT NULL REFERENCES attachments (id) ON DELETE CASCADE,
        UNIQUE (parcel_id, attachment_id)
    );

CREATE TABLE
    sales_attachments (
        id SERIAL PRIMARY KEY,
        sale_id INTEGER NOT NULL REFERENCES sales (id) ON DELETE CASCADE,
        attachment_id INTEGER NOT NULL REFERENCES attachments (id) ON DELETE CASCADE,
        UNIQUE (sale_id, attachment_id)
    );

CREATE TABLE
    appeal_attachments (
        id SERIAL PRIMARY KEY,
        appeal_id INTEGER NOT NULL REFERENCES parcel_value_appeal (id) ON DELETE CASCADE,
        attachment_id INTEGER NOT NULL REFERENCES attachments (id) ON DELETE CASCADE,
        UNIQUE (appeal_id, attachment_id)
    );