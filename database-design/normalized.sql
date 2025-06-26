CREATE TABLE
    parcels (
        id TEXT PRIMARY KEY,
        created_at TIMESTAMP DEFAULT now (),
        retired_at TIMESTAMP DEFAULT NULL
    );

CREATE TABLE
    parcel_join (
        child_parcel TEXT REFERENCES parcels (id) ON DELETE CASCADE,
        parent_parcel TEXT REFERENCES parcels (id) ON DELETE CASCADE
    );

CREATE TABLE
    parcel_values (
        id SERIAL PRIMARY KEY,
        parcel_id TEXT NOT NULL REFERENCES parcels (id) ON DELETE CASCADE,
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
        res_land INTEGER NOT NULL DEFAULT 0,
        res_building INTEGER NOT NULL DEFAULT 0,
        res_new_construction INTEGER NOT NULL DEFAULT 0,
        com_land INTEGER NOT NULL DEFAULT 0,
        com_building INTEGER NOT NULL DEFAULT 0,
        com_new_construction INTEGER NOT NULL DEFAULT 0,
        agr_land INTEGER NOT NULL DEFAULT 0,
        agr_building INTEGER NOT NULL DEFAULT 0,
        agr_new_construction INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT now ()
    );

CREATE TABLE
    types (
        key SERIAL PRIMARY KEY,
        description TEXT,
        active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT now ()
    );

CREATE TABLE
    type_values (
        id SERIAL PRIMARY KEY,
        type_key INTEGER NOT NULL REFERENCES types (key) ON DELETE CASCADE,
        value TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT now ()
    );

CREATE TABLE
    parcel_type_values (
        id SERIAL PRIMARY KEY,
        parcel_id TEXT NOT NULL REFERENCES parcels (id) ON DELETE CASCADE,
        type_value_id INTEGER NOT NULL REFERENCES type_values (id) ON DELETE CASCADE,
        effective_date DATE NOT NULL DEFAULT now (),
        created_at TIMESTAMP DEFAULT now ()
    );

CREATE TABLE
    attributes (
        key SERIAL PRIMARY KEY,
        description TEXT,
        active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT now ()
    );

CREATE TABLE
    attribute_values (
        id SERIAL PRIMARY KEY,
        type_key INTEGER NOT NULL REFERENCES types (key) ON DELETE CASCADE,
        value TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT now ()
    );

CREATE TABLE
    parcel_attribute_values (
        id SERIAL PRIMARY KEY,
        parcel_id TEXT NOT NULL REFERENCES parcels (id) ON DELETE CASCADE,
        attribute_value_id INTEGER NOT NULL REFERENCES attribute_values (id) ON DELETE CASCADE,
        effective_date DATE NOT NULL DEFAULT now (),
        created_at TIMESTAMP DEFAULT now ()
    );