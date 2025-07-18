drop table if exists test_comparables cascade;

CREATE TABLE
    test_comparables (
        parcel_id BIGINT REFERENCES test_parcels (id) ON DELETE CASCADE,
        sale_id NUMERIC,
        net_selling_price NUMERIC,
        date_of_sale TIMESTAMP,
        address TEXT,
        neighborhood_group TEXT,
        neighborhood_code NUMERIC,
        land_use TEXT,
        total_living_area NUMERIC,
        garage_area NUMERIC,
        adjusted_age INTEGER,
        stories NUMERIC,
        cdu INTEGER,
        lat NUMERIC,
        lon NUMERIC,
        subject_parcel BIGINT REFERENCES test_parcels (id) ON DELETE CASCADE,
        subject_appraised_total INTEGER,
        subject_address TEXT,
        subject_land_use TEXT,
        subject_cdu INTEGER,
        subject_total_living_area NUMERIC,
        subject_neighborhood_group TEXT,
        subject_neighborhood_code NUMERIC,
        subject_lat NUMERIC,
        subject_lon NUMERIC,
        gower_dist NUMERIC,
        cdu_diff INTEGER,
        total_living_area_diff NUMERIC,
        cdu_coeff NUMERIC,
        total_living_area_coeff NUMERIC,
        adjusted_price NUMERIC,
        miles_distance NUMERIC
    );

drop table if exists test_comparables cascade;

CREATE TABLE
    test_comparables (
        parcel_id BIGINT REFERENCES test_parcels (id) ON DELETE CASCADE,
        land_use TEXT,
        grade TEXT,
        gla NUMERIC,
        story NUMERIC,
        cdu TEXT,
        cost_group TEXT,
        year_built INTEGER,
        neighborhood NUMERIC,
        neighborhood_group TEXT,
        address TEXT,
        garage_area NUMERIC,
        lat NUMERIC,
        lon NUMERIC,
        sale_id NUMERIC,
        net_selling_price NUMERIC,
        date_of_sale TIMESTAMP,
        subject_parcel BIGINT REFERENCES test_parcels (id) ON DELETE CASCADE,
        subject_address TEXT,
        subject_land_use TEXT,
        subject_cdu TEXT,
        subject_gla NUMERIC,
        subject_neighborhood_group TEXT,
        subject_garage_area NUMERIC,
        subject_story NUMERIC,
        subject_year_built INTEGER,
        subject_cost_group TEXT,
        subject_lat NUMERIC,
        subject_lon NUMERIC,
        subject_appraised_total NUMERIC,
        gower_dist NUMERIC,
        cdu_adjustment NUMERIC,
        neighborhood_group_adjustment NUMERIC,
        cost_group_adjustment NUMERIC,
        land_use_adjustment NUMERIC,
        gla_adjustment NUMERIC,
        year_built_adjustment NUMERIC,
        story_adjustment NUMERIC,
        garage_area_adjustment NUMERIC,
        adjusted_sale_price NUMERIC,
        miles_distance NUMERIC
    );

create table
    test_images (
        id serial primary key,
        image_url text not null,
        created_at timestamp default now ()
    );

create table
    test_parcel_images (
        id serial primary key,
        parcel_id text not null references test_parcels (id) on delete cascade,
        image_id integer not null references test_images (id) on delete cascade,
        created_at timestamp default now (),
        unique (parcel_id, image_id)
    );

create table
    test_parcel_image_primary (
        id serial primary key,
        parcel_id text not null references test_parcels (id) on delete cascade,
        image_id integer not null references test_images (id) on delete cascade,
        created_at timestamp default now (),
        effective_date date not null default now (),
        unique (parcel_id, image_id, effective_date)
    );