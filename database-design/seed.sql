INSERT INTO
    parcels (parcel_number)
VALUES
    ('123456789'),
    ('987654321'),
    ('111222333'),
    ('444555666'),
    ('777888999'),
    ('000111222'),
    ('333444555'),
    ('666777888'),
    ('999000111'),
    ('222333444'),
    ('555666777'),
    ('888999000'),
    ('123123123'),
    ('456456456'),
    ('789789789'),
    ('321321321'),
    ('654654654'),
    ('987987987'),
    ('111111111'),
    ('222222222');

INSERT INTO
    buildings (name, construction_start_date)
VALUES
    ('Building A', '2000-01-01'),
    ('Building B', '2005-05-15'),
    ('Building C', '2010-10-10'),
    ('Building D', '2015-03-20'),
    ('Building E', '2020-07-30'),
    ('Building F', '2018-08-08'),
    ('Building G', '2012-12-12'),
    ('Building H', '2003-04-04'),
    ('Building I', '2008-09-09'),
    ('Building J', '2016-06-06'),
    ('Building K', '2021-11-11'),
    ('Building L', '2014-02-02'),
    ('Building M', '2007-07-07'),
    ('Building N', '2019-10-10'),
    ('Building O', '2011-01-01'),
    ('Building P', '2006-12-12'),
    ('Building Q', '2013-03-03'),
    ('Building R', '2022-05-05'),
    ('Building S', '2009-08-08'),
    ('Building T', '2017-04-04');

INSERT INTO
    building_sections (
        building_id,
        unit_number,
        floor,
        finished_area,
        unfinished_area,
        construction_start_date,
        construction_completion_date
    )
VALUES
    (
        1,
        'A101',
        1,
        1000,
        200,
        '2000-01-01',
        '2000-06-01'
    ),
    (
        1,
        'A102',
        1,
        1200,
        300,
        '2000-01-01',
        '2000-06-01'
    ),
    (
        2,
        'B201',
        2,
        1500,
        400,
        '2005-05-15',
        '2006-05-15'
    ),
    (
        2,
        'B202',
        2,
        1600,
        500,
        '2005-05-15',
        '2006-05-15'
    ),
    (
        3,
        'C301',
        3,
        1800,
        600,
        '2010-10-10',
        '2011-10-10'
    ),
    (
        3,
        'C302',
        3,
        1900,
        700,
        '2010-10-10',
        '2011-10-10'
    ),
    (
        4,
        'D401',
        4,
        2100,
        800,
        '2015-03-20',
        '2016-03-20'
    ),
    (
        4,
        'D402',
        4,
        2200,
        900,
        '2015-03-20',
        '2016-03-20'
    ),
    (
        5,
        'E501',
        5,
        2500,
        1000,
        '2020-07-30',
        '2021-07-30'
    ),
    (
        5,
        'E502',
        5,
        2600,
        1100,
        '2020-07-30',
        '2021-07-30'
    ),
    (
        6,
        'F601',
        6,
        2800,
        1200,
        '2018-08-08',
        '2019-08-08'
    ),
    (
        6,
        'F602',
        6,
        2900,
        1300,
        '2018-08-08',
        '2019-08-08'
    ),
    (
        7,
        'G701',
        7,
        3200,
        1400,
        '2012-12-12',
        '2013-12-12'
    ),
    (
        7,
        'G702',
        7,
        3300,
        1500,
        '2012-12-12',
        '2013-12-12'
    ),
    (
        8,
        'H801',
        8,
        3600,
        1600,
        '2003-04-04',
        '2004-04-04'
    ),
    (
        8,
        'H802',
        8,
        3700,
        1700,
        '2003-04-04',
        '2004-04-04'
    ),
    (
        9,
        'I901',
        9,
        4000,
        1800,
        '2008-09-09',
        '2009-09-09'
    ),
    (
        9,
        'I902',
        9,
        4100,
        1900,
        '2008-09-09',
        '2009-09-09'
    ),
    (
        10,
        'J1001',
        10,
        4500,
        2000,
        '2016-06-06',
        '2017-06-06'
    ),
    (
        10,
        'J1002',
        10,
        4600,
        2100,
        '2016-06-06',
        '2017-06-06'
    ),
    (
        11,
        'K1101',
        11,
        5000,
        2200,
        '2021-11-11',
        '2022-11-11'
    ),
    (
        11,
        'K1102',
        11,
        5100,
        2300,
        '2021-11-11',
        '2022-11-11'
    ),
    (
        12,
        'L1201',
        12,
        5500,
        2400,
        '2014-02-02',
        '2015-02-02'
    ),
    (
        12,
        'L1202',
        12,
        5600,
        2500,
        '2014-02-02',
        '2015-02-02'
    ),
    (
        13,
        'M1301',
        13,
        6000,
        2600,
        '2007-07-07',
        '2008-07-07'
    ),
    (
        13,
        'M1302',
        13,
        6100,
        2700,
        '2007-07-07',
        '2008-07-07'
    ),
    (
        14,
        'N1401',
        14,
        6500,
        2800,
        '2019-10-10',
        '2020-10-10'
    ),
    (
        14,
        'N1402',
        14,
        6600,
        2900,
        '2019-10-10',
        '2020-10-10'
    ),
    (
        15,
        'O1501',
        15,
        7000,
        3000,
        '2011-01-01',
        '2012-01-01'
    ),
    (
        15,
        'O1502',
        15,
        7100,
        3100,
        '2011-01-01',
        '2012-01-01'
    ),
    (
        16,
        'P1601',
        16,
        7500,
        3200,
        '2006-12-12',
        '2007-12-12'
    ),
    (
        16,
        'P1602',
        16,
        7600,
        3300,
        '2006-12-12',
        '2007-12-12'
    ),
    (
        17,
        'Q1701',
        17,
        8000,
        3400,
        '2013-03-03',
        '2014-03-03'
    ),
    (
        17,
        'Q1702',
        17,
        8100,
        3500,
        '2013-03-03',
        '2014-03-03'
    ),
    (
        18,
        'R1801',
        18,
        8500,
        3600,
        '2022-05-05',
        '2023-05-05'
    ),
    (
        18,
        'R1802',
        18,
        8600,
        3700,
        '2022-05-05',
        '2023-05-05'
    ),
    (
        19,
        'S1901',
        19,
        9000,
        3800,
        '2009-08-08',
        '2010-08-08'
    ),
    (
        19,
        'S1902',
        19,
        9100,
        3900,
        '2009-08-08',
        '2010-08-08'
    ),
    (
        20,
        'T2001',
        20,
        9500,
        4000,
        '2017-04-04',
        '2018-04-04'
    );

INSERT INTO
    building_section_parcels (
        parcel_id,
        building_section_id,
        start_date,
        end_date,
        is_primary
    )
VALUES
    (1, 1, '2000-01-01', NULL, TRUE),
    (2, 2, '2005-05-15', NULL, TRUE),
    (3, 3, '2010-10-10', NULL, TRUE),
    (4, 4, '2015-03-20', NULL, TRUE),
    (5, 5, '2020-07-30', NULL, TRUE),
    (6, 6, '2018-08-08', NULL, TRUE),
    (7, 7, '2012-12-12', NULL, TRUE),
    (8, 8, '2003-04-04', NULL, TRUE),
    (9, 9, '2008-09-09', NULL, TRUE),
    (10, 10, '2016-06-06', NULL, TRUE),
    (11, 11, '2021-11-11', NULL, TRUE),
    (12, 12, '2014-02-02', NULL, TRUE),
    (13, 13, '2007-07-07', NULL, TRUE),
    (14, 14, '2019-10-10', NULL, TRUE),
    (15, 15, '2011-01-01', NULL, TRUE),
    (16, 16, '2006-12-12', NULL, TRUE),
    (17, 17, '2013-03-03', NULL, TRUE),
    (18, 18, '2022-05-05', NULL, TRUE),
    (19, 19, '2009-08-08', NULL, TRUE),
    (20, 20, '2017-04-04', NULL, TRUE);

INSERT INTO
    building_section_status (
        building_section_parcel_id,
        status,
        effective_date,
        notes
    )
VALUES
    (1, 'active', '2000-01-01', 'Initial status'),
    (2, 'active', '2005-05-15', 'Initial status'),
    (3, 'active', '2010-10-10', 'Initial status'),
    (4, 'active', '2015-03-20', 'Initial status'),
    (5, 'active', '2020-07-30', 'Initial status'),
    (6, 'active', '2018-08-08', 'Initial status'),
    (7, 'active', '2012-12-12', 'Initial status'),
    (8, 'active', '2003-04-04', 'Initial status'),
    (9, 'active', '2008-09-09', 'Initial status'),
    (10, 'active', '2016-06-06', 'Initial status'),
    (11, 'active', '2021-11-11', 'Initial status'),
    (12, 'active', '2014-02-02', 'Initial status'),
    (13, 'active', '2007-07-07', 'Initial status'),
    (14, 'active', '2019-10-10', 'Initial status'),
    (15, 'active', '2011-01-01', 'Initial status'),
    (16, 'active', '2006-12-12', 'Initial status'),
    (17, 'active', '2013-03-03', 'Initial status'),
    (18, 'active', '2022-05-05', 'Initial status'),
    (19, 'active', '2009-08-08', 'Initial status'),
    (
        20,
        'under_construction',
        '2017-04-04',
        'Section under construction'
    );

-- No initial status for the last section
INSERT INTO
    building_section_conditions (
        building_section_parcel_id,
        effective_date,
        condition,
        notes
    )
VALUES
    (1, '2000-01-01', 100, 'Newly constructed'),
    (2, '2005-05-15', 100, 'Newly constructed'),
    (3, '2010-10-10', 100, 'Newly constructed'),
    (4, '2015-03-20', 100, 'Newly constructed'),
    (5, '2020-07-30', 100, 'Newly constructed'),
    (6, '2018-08-08', 100, 'Newly constructed'),
    (7, '2012-12-12', 100, 'Newly constructed'),
    (8, '2003-04-04', 100, 'Newly constructed'),
    (9, '2008-09-09', 100, 'Newly constructed'),
    (10, '2016-06-06', 100, 'Newly constructed'),
    (11, '2021-11-11', 100, 'Newly constructed'),
    (12, '2014-02-02', 100, 'Newly constructed'),
    (13, '2007-07-07', 100, 'Newly constructed'),
    (14, '2019-10-10', 100, 'Newly constructed'),
    (15, '2011-01-01', 100, 'Newly constructed'),
    (16, '2006-12-12', 100, 'Newly constructed'),
    (17, '2013-03-03', 100, 'Newly constructed'),
    (18, '2022-05-05', 100, 'Newly constructed'),
    (19, '2009-08-08', 100, 'Newly constructed'),
    (
        20,
        '2017-04-04',
        100,
        'Section under construction'
    );

-- No initial condition for the last section
INSERT INTO
    addresses (house_number, street, city, state, zip_code)
VALUES
    ('123', 'Main St', 'St. Louis', 'MO', '63101'),
    ('456', 'Broadway Ave', 'St. Louis', 'MO', '63102'),
    ('789', 'Market St', 'St. Louis', 'MO', '63103'),
    ('101', 'Pine St', 'St. Louis', 'MO', '63104'),
    ('202', 'Oak St', 'St. Louis', 'MO', '63105'),
    ('303', 'Cedar Ave', 'St. Louis', 'MO', '63106'),
    ('404', 'Elm St', 'St. Louis', 'MO', '63107'),
    ('505', 'Maple Dr', 'St. Louis', 'MO', '63108'),
    ('606', 'Birch Ln', 'St. Louis', 'MO', '63109'),
    ('707', 'Spruce Way', 'St. Louis', 'MO', '63110');

INSERT INTO
    parcel_addresses (
        parcel_id,
        address_id,
        start_date,
        end_date,
        is_primary
    )
VALUES
    (1, 1, '2000-01-01', NULL, TRUE),
    (2, 2, '2005-05-15', NULL, TRUE),
    (3, 3, '2010-10-10', NULL, TRUE),
    (4, 4, '2015-03-20', NULL, TRUE),
    (5, 5, '2020-07-30', NULL, TRUE),
    (6, 6, '2018-08-08', NULL, TRUE),
    (7, 7, '2012-12-12', NULL, TRUE),
    (8, 8, '2003-04-04', NULL, TRUE),
    (9, 9, '2008-09-09', NULL, TRUE),
    (10, 10, '2016-06-06', NULL, TRUE);

INSERT INTO
    building_addresses (
        building_id,
        address_id,
        start_date,
        end_date,
        is_primary
    )
VALUES
    (1, 1, '2000-01-01', NULL, TRUE),
    (2, 2, '2005-05-15', NULL, TRUE),
    (3, 3, '2010-10-10', NULL, TRUE),
    (4, 4, '2015-03-20', NULL, TRUE),
    (5, 5, '2020-07-30', NULL, TRUE),
    (6, 6, '2018-08-08', NULL, TRUE),
    (7, 7, '2012-12-12', NULL, TRUE),
    (8, 8, '2003-04-04', NULL, TRUE),
    (9, 9, '2008-09-09', NULL, TRUE),
    (10, 10, '2016-06-06', NULL, TRUE);

INSERT INTO
    owners (name, phone, email, tax_id)
VALUES
    (
        'John Doe',
        '555-1234',
        'jdoe@example.com',
        '123-45-6789'
    ),
    (
        'Jane Smith',
        '555-5678',
        'jdoe@example.com',
        '987-65-4321'
    ),
    ('Acme Corp', '555-8765', 'email', '111-22-3333'),
    (
        'Global Holdings',
        '555-4321',
        'email',
        '444-55-6666'
    ),
    (
        'Real Estate LLC',
        '555-6789',
        'email',
        '777-88-9999'
    ),
    (
        'Investment Group',
        '555-3456',
        'email',
        '000-11-2222'
    ),
    (
        'Smith Family Trust',
        '555-7890',
        'email',
        '333-44-5555'
    ),
    (
        'Jones Properties',
        '555-2345',
        'email',
        '666-77-8888'
    ),
    (
        'Doe Enterprises',
        '555-8901',
        'email',
        '999-00-1111'
    ),
    (
        'Tech Innovations Inc.',
        '555-4567',
        'email',
        '222-33-4444'
    ),
    (
        'Green Ventures',
        '555-0123',
        'email',
        '555-66-7777'
    ),
    (
        'Urban Developments',
        '555-3456',
        'email',
        '888-99-0000'
    ),
    (
        'Pinnacle Realty',
        '555-7890',
        'email',
        '111-22-3333'
    ),
    (
        'Legacy Properties',
        '555-2345',
        'email',
        '444-55-6666'
    ),
    (
        'Future Investments',
        '555-6789',
        'email',
        '777-88-9999'
    ),
    (
        'Metro Holdings',
        '555-0123',
        'email',
        '000-11-2222'
    ),
    (
        'Capital Group',
        '555-4567',
        'email',
        '333-44-5555'
    ),
    (
        'Skyline Realty',
        '555-8901',
        'email',
        '666-77-8888'
    ),
    (
        'Summit Properties',
        '555-2345',
        'email',
        '999-00-1111'
    );

INSERT INTO
    owner_addresses (
        owner_id,
        address_id,
        start_date,
        end_date,
        is_primary
    )
VALUES
    (1, 1, '2000-01-01', NULL, TRUE),
    (2, 2, '2005-05-15', NULL, TRUE),
    (3, 3, '2010-10-10', NULL, TRUE),
    (4, 4, '2015-03-20', NULL, TRUE),
    (5, 5, '2020-07-30', NULL, TRUE),
    (6, 6, '2018-08-08', NULL, TRUE),
    (7, 7, '2012-12-12', NULL, TRUE),
    (8, 8, '2003-04-04', NULL, TRUE),
    (9, 9, '2008-09-09', NULL, TRUE),
    (10, 10, '2016-06-06', NULL, TRUE);

INSERT INTO
    parcel_ownerships (
        parcel_id,
        owner_id,
        start_date,
        end_date,
        ownership_type,
        is_primary
    )
VALUES
    (1, 1, '2000-01-01', NULL, 'individual', TRUE),
    (2, 2, '2005-05-15', NULL, 'individual', TRUE),
    (3, 3, '2010-10-10', NULL, 'corporation', TRUE),
    (4, 4, '2015-03-20', NULL, 'corporation', TRUE),
    (5, 5, '2020-07-30', NULL, 'LLC', TRUE),
    (6, 6, '2018-08-08', NULL, 'LLC', TRUE),
    (7, 7, '2012-12-12', NULL, 'trust', TRUE),
    (8, 8, '2003-04-04', NULL, 'trust', TRUE),
    (9, 9, '2008-09-09', NULL, 'partnership', TRUE),
    (10, 10, '2016-06-06', NULL, 'partnership', TRUE);

INSERT INTO
    parcel_values (parcel_id, for_tax_year, value_type)
VALUES
    (1, 2023, 'cost'),
    (2, 2023, 'sales_model'),
    (3, 2023, 'income'),
    (4, 2023, 'sales_comparables'),
    (5, 2023, 'appeal'),
    (6, 2023, 'custom'),
    (7, 2023, 'cost'),
    (8, 2023, 'sales_model'),
    (9, 2023, 'income'),
    (10, 2023, 'sales_comparables');

INSERT INTO
    parcel_value_status (parcel_value_id, status, effective_date, notes)
VALUES
    (
        1,
        'draft',
        '2023-01-01',
        'Initial value pending review'
    ),
    (
        2,
        'approved',
        '2023-02-01',
        'Value approved by assessor'
    ),
    (
        3,
        'under_review',
        '2023-03-01',
        'Value under review for accuracy'
    ),
    (
        4,
        'rejected',
        '2023-04-01',
        'Value rejected due to discrepancies'
    ),
    (
        5,
        'made_in_error',
        '2023-05-01',
        'Value corrected due to clerical error'
    ),
    (
        6,
        'draft',
        '2023-06-01',
        'Custom value set by assessor' -- Custom value
    ), -- No status for custom value
    (
        7,
        'draft',
        '2023-01-01',
        'Initial value pending review'
    ),
    (
        8,
        'approved',
        '2023-02-01',
        'Value approved by assessor'
    ),
    (
        9,
        'under_review',
        '2023-03-01',
        'Value under review for accuracy'
    ),
    (
        10,
        'rejected',
        '2023-04-01',
        'Value rejected due to discrepancies'
    );

-- No status for sales comparables
INSERT INTO
    parcel_value_cost (
        id,
        land_value,
        building_value,
        depreciation_amount,
        total_value
    )
VALUES
    (1, 50000, 150000, 20000, 180000),
    (2, 20000, 120000, 15000, 135000), -- No cost value for sales model
    (7, 60000, 160000, 25000, 195000),
    (8, 30000, 140000, 20000, 150000), -- No cost value for income
    (9, 40000, 170000, 30000, 180000), -- No cost value for sales comparables
    (10, 25000, 130000, 18000, 145000);

-- No cost value for sales comparables
INSERT INTO
    parcel_value_sales_comparables (
        id,
        comparable_sales_count,
        adjusted_average_price,
        adjustments,
        total_value
    )
VALUES
    (
        1,
        5,
        175000,
        'Adjustment for location, size',
        180000
    ),
    (4, 3, 160000, 'Adjustment for condition', 165000), -- No sales comparables for sales model
    (5, 4, 190000, 'Adjustment for age', 195000), -- No sales comparables for income
    (6, 2, 150000, 'Adjustment for amenities', 155000), -- No sales comparables for appeal
    (
        7,
        6,
        200000,
        'Adjustment for market trends',
        205000
    );

-- No sales comparables for appeal
INSERT INTO
    parcel_value_appeal (
        id,
        appeal_number,
        decision_date,
        final_value,
        notes
    )
VALUES
    (
        1,
        'AP-2023-001',
        '2023-06-01',
        175000,
        'Appeal granted, value reduced'
    ),
    (
        2,
        'AP-2023-002',
        '2023-07-01',
        160000,
        'Appeal denied, value unchanged'
    ), -- No appeal for sales model
    (
        3,
        'AP-2023-003',
        '2023-08-01',
        195000,
        'Appeal granted, value increased'
    ), -- No appeal for income
    (
        4,
        'AP-2023-004',
        '2023-09-01',
        150000,
        'Appeal denied, value unchanged'
    ), -- No appeal for sales comparables
    (
        5,
        'AP-2023-005',
        '2023-10-01',
        145000,
        'Appeal granted, value reduced'
    ), -- No appeal for custom
    (
        6,
        'AP-2023-006',
        '2023-11-01',
        205000,
        'Appeal granted, value increased'
    );

-- No appeal for cost
-- No appeal for sales comparables
INSERT INTO
    parcel_value_sales_model (id, model_id, predicted_value, prediction_date)
VALUES
    (1, 1, 180000.00, '2023-01-15'),
    (2, 2, 175000.00, '2023-02-15'),
    (3, 3, 195000.00, '2023-03-15'),
    (4, 4, 165000.00, '2023-04-15'),
    (5, 5, 150000.00, '2023-05-15'),
    (6, 6, 205000.00, '2023-06-15');

-- No sales model for appeal
INSERT INTO
    parcel_value_income (
        id,
        gross_income,
        operating_expenses,
        net_operating_income,
        capitalization_rate,
        total_value
    )
VALUES
    (1, 50000.00, 20000.00, 30000.00, 0.08, 375000.00),
    (2, 60000.00, 25000.00, 35000.00, 0.07, 500000.00), -- No income value for sales model
    (3, 70000.00, 30000.00, 40000.00, 0.06, 666666.67), -- No income value for income
    (4, 80000.00, 35000.00, 45000.00, 0.05, 900000.00);

-- No income value for sales comparables
-- No income value for appeal
INSERT INTO
    sales (date_of_sale, net_selling_price, report_date)
VALUES
    ('2023-01-10', 200000.00, '2023-01-15'),
    ('2023-02-20', 250000.00, '2023-02-25'),
    ('2023-03-15', 300000.00, '2023-03-20'),
    ('2023-04-05', 350000.00, '2023-04-10'),
    ('2023-05-25', 400000.00, '2023-05-30'),
    ('2023-06-15', 450000.00, '2023-06-20'),
    ('2023-07-10', 500000.00, '2023-07-15'),
    ('2023-08-01', 550000.00, '2023-08-05'),
    ('2023-09-20', 600000.00, '2023-09-25'),
    ('2023-10-10', 650000.00, '2023-10-15');

INSERT INTO
    sale_status (sale_id, sale_type, description, effective_date)
VALUES
    (
        1,
        'arms_length',
        'Standard arms-length sale',
        '2023-01-10'
    ),
    (
        2,
        'under_contract',
        'Sale under contract',
        '2023-02-20'
    ),
    (
        3,
        'non_arms_length',
        'Non-arms-length transaction',
        '2023-03-15'
    ),
    (
        4,
        'foreclosure',
        'Foreclosure sale',
        '2023-04-05'
    ),
    (
        5,
        'gift',
        'Property gifted to family member',
        '2023-05-25'
    ),
    (6, 'other', 'Other type of sale', '2023-06-15'),
    (
        7,
        'arms_length',
        'Standard arms-length sale',
        '2023-07-10'
    ),
    (
        8,
        'under_contract',
        'Sale under contract',
        '2023-08-01'
    ),
    (
        9,
        'non_arms_length',
        'Non-arms-length transaction',
        '2023-09-20'
    ),
    (
        10,
        'foreclosure',
        'Foreclosure sale',
        '2023-10-10'
    );

-- No status for the last sale
INSERT INTO
    sale_parcel_buyers (sale_id, parcel_id, buyer_name, buyer_type)
VALUES
    (1, 1, 'John Doe', 'individual'),
    (2, 2, 'Jane Smith', 'individual'),
    (3, 3, 'Acme Corp', 'corporation'),
    (4, 4, 'Global Holdings', 'corporation'),
    (5, 5, 'Real Estate LLC', 'corporation'),
    (6, 6, 'Investment Group', 'corporation'),
    (7, 7, 'Smith Family Trust', 'trust'),
    (8, 8, 'Jones Properties', 'trust'),
    (9, 9, 'Doe Enterprises', 'partnership'),
    (10, 10, 'Tech Innovations Inc.', 'partnership');

-- No buyers for the last sale
INSERT INTO
    sale_building_sections (
        sale_id,
        building_section_parcel_id,
        condition_at_sale,
        notes
    )
VALUES
    (
        1,
        1,
        100,
        'Building section in excellent condition at time of sale'
    ),
    (2, 2, 95, 'Building section well-maintained'),
    (3, 3, 90, 'Building section in good condition'),
    (4, 4, 85, 'Building section needs minor repairs'),
    (
        5,
        5,
        80,
        'Building section requires significant repairs'
    ),
    (6, 6, 75, 'Building section in fair condition'),
    (
        7,
        7,
        70,
        'Building section needs major renovations'
    ),
    (8, 8, 65, 'Building section in poor condition'),
    (
        9,
        9,
        60,
        'Building section requires complete overhaul'
    ),
    (
        10,
        10,
        55,
        'Building section under construction at time of sale'
    );

-- No building sections for the last sale
INSERT INTO
    tax_rates (code, description)
VALUES
    ('TR-2023-001', 'General Property Tax Rate 2023'),
    ('TR-2023-002', 'School District Tax Rate 2023'),
    ('TR-2023-003', 'City Tax Rate 2023'),
    ('TR-2023-004', 'County Tax Rate 2023'),
    ('TR-2023-005', 'Fire District Tax Rate 2023'),
    ('TR-2023-006', 'Library Tax Rate 2023'),
    ('TR-2023-007', 'Road Maintenance Tax Rate 2023'),
    ('TR-2023-008', 'Park District Tax Rate 2023'),
    ('TR-2023-009', 'Hospital District Tax Rate 2023'),
    ('TR-2023-010', 'Community College Tax Rate 2023');

INSERT INTO
    tax_rate_years (tax_rate_id, tax_year, rate, rate_type)
VALUES
    (1, 2023, 0.0125, 'percentage'),
    (2, 2023, 0.0150, 'percentage'),
    (3, 2023, 0.0100, 'percentage'),
    (4, 2023, 0.0080, 'percentage'),
    (5, 2023, 0.0050, 'percentage'),
    (6, 2023, 0.0035, 'percentage'),
    (7, 2023, 0.0025, 'percentage'),
    (8, 2023, 0.0015, 'percentage'),
    (9, 2023, 0.0040, 'percentage'),
    (10, 2023, 0.0060, 'percentage');

INSERT INTO
    parcel_tax_rates (parcel_id, rate_year_id)
VALUES
    (1, 1),
    (2, 2),
    (3, 3),
    (4, 4),
    (5, 5),
    (6, 6),
    (7, 7),
    (8, 8),
    (9, 9),
    (10, 10),
    (11, 1),
    (12, 2),
    (13, 3),
    (14, 4),
    (15, 5),
    (16, 6),
    (17, 7),
    (18, 8),
    (19, 9),
    (20, 10);