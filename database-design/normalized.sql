drop table if exists test_parcels cascade;

CREATE TABLE
    test_parcels (
        id BIGINT PRIMARY KEY,
        block INTEGER NOT NULL,
        lot INTEGER NOT NULL,
        ext INTEGER DEFAULT 0 NOT NULL,
        created_at TIMESTAMP DEFAULT '2020-01-01 00:00:00',
        retired_at TIMESTAMP DEFAULT NULL,
        UNIQUE (block, lot, ext)
    );

drop table if exists test_parcel_joins cascade;

CREATE TABLE
    test_parcel_join (
        child_parcel TEXT REFERENCES test_parcels (id) ON DELETE CASCADE,
        parent_parcel TEXT REFERENCES tesst_parcels (id) ON DELETE CASCADE
    );

drop table if exists test_parcel_values cascade;

CREATE TABLE
    test_parcel_values (
        id SERIAL PRIMARY KEY,
        parcel_id TEXT NOT NULL REFERENCES test_parcels (id) ON DELETE CASCADE,
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

drop table if exists test_types cascade;

CREATE TABLE
    test_types (
        key TEXT PRIMARY KEY,
        description TEXT,
        active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT now ()
    );

drop table if exists test_type_values cascade;

CREATE TABLE
    test_type_values (
        type_key TEXT NOT NULL REFERENCES test_types (key) ON DELETE CASCADE,
        value TEXT NOT NULL,
        active BOOLEAN NOT NULL DEFAULT TRUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT now (),
        PRIMARY KEY (type_key, value)
    );

drop table if exists test_parcel_type_values cascade;

CREATE TABLE
    test_parcel_type_values (
        id SERIAL PRIMARY KEY,
        parcel_id TEXT NOT NULL REFERENCES test_parcels (id) ON DELETE CASCADE,
        effective_date DATE NOT NULL DEFAULT now (),
        created_at TIMESTAMP DEFAULT now (),
        type_key TEXT NOT NULL,
        value TEXT NOT NULL,
        FOREIGN KEY (type_key, value) REFERENCES test_type_values (type_key, value) ON DELETE CASCADE,
        UNIQUE (parcel_id, type_key, value, effective_date)
    );

drop table if exists test_attributes cascade;

CREATE TABLE
    test_attributes (
        key TEXT PRIMARY KEY,
        description TEXT,
        active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT now ()
    );

drop table if exists test_attribute_values cascade;

CREATE TABLE
    test_attribute_values (
        attribute_key TEXT NOT NULL REFERENCES test_attributes (key) ON DELETE CASCADE,
        value TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT now (),
        description TEXT,
        active BOOLEAN NOT NULL DEFAULT TRUE,
        PRIMARY KEY (attribute_key, value)
    );

drop table if exists test_parcel_attribute_values cascade;

CREATE TABLE
    parcel_attribute_values (
        id SERIAL PRIMARY KEY,
        parcel_id TEXT NOT NULL REFERENCES test_parcels (id) ON DELETE CASCADE,
        effective_date DATE NOT NULL DEFAULT now (),
        end_date DATE DEFAULT NULL,
        created_at TIMESTAMP DEFAULT now (),
        attribute_key TEXT NOT NULL,
        value TEXT NOT NULL,
        FOREIGN KEY (attribute_key, value) REFERENCES test_attribute_values (attribute_key, value) ON DELETE CASCADE,
        UNIQUE (parcel_id, attribute_key, value, effective_date)
    );

CREATE TABLE
    buildings (
        id SERIAL PRIMARY KEY,
        building_type TEXT NOT NULL,
        total_finished_area INTEGER NOT NULL DEFAULT 0,
        total_unfinished_area INTEGER NOT NULL DEFAULT 0,
        units INTEGER NOT NULL DEFAULT 0,
        year_built INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT now ()
    );

CREATE TABLE
    building_sections (
        id SERIAL PRIMARY KEY,
        building_id INTEGER NOT NULL REFERENCES buildings (id) ON DELETE CASCADE,
        parcel_id TEXT NOT NULL REFERENCES parcels (id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        total_finished_area INTEGER NOT NULL DEFAULT 0,
        total_unfinished_area INTEGER NOT NULL DEFAULT 0
    );