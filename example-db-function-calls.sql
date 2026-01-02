-- ============================================================
-- EXAMPLE-DB-FUNCTION-CALLS.SQL: Test calls for all database functions
-- ============================================================
-- Run this after seeding the database to test all functions
-- This file demonstrates how to call each function with realistic parameters

-- ============================================================
-- SETUP: Get some sample data for testing
-- ============================================================

-- Get sample parcel IDs for testing
DO $$
DECLARE
    sample_parcel_id bigint;
    sample_parcel_id_2 bigint;
    sample_employee_id bigint;
    sample_employee_uuid uuid;
    sample_review_ids bigint[];
    sample_building_id bigint;
    sample_land_id bigint;
BEGIN
    -- Get some sample data
    SELECT id INTO sample_parcel_id FROM public.parcels_v2 LIMIT 1;
    SELECT id INTO sample_parcel_id_2 FROM public.parcels_v2 OFFSET 1 LIMIT 1;
    SELECT id INTO sample_employee_id FROM public.employees_v2 WHERE can_approve = true LIMIT 1;
    SELECT user_id INTO sample_employee_uuid FROM public.employees_v2 WHERE user_id IS NOT NULL LIMIT 1;
    SELECT id INTO sample_building_id FROM public.buildings_v2 LIMIT 1;
    SELECT id INTO sample_land_id FROM public.lands_v2 LIMIT 1;
    
    RAISE NOTICE '============================================================';
    RAISE NOTICE 'TESTING DATABASE FUNCTIONS';
    RAISE NOTICE '============================================================';
    RAISE NOTICE 'Sample Parcel ID: %', sample_parcel_id;
    RAISE NOTICE 'Sample Employee ID: %', sample_employee_id;
    RAISE NOTICE 'Sample Employee UUID: %', sample_employee_uuid;
    RAISE NOTICE '============================================================';
    
    -- ============================================================
    -- TEST 1: mass_create_reviews_v2()
    -- ============================================================
    RAISE NOTICE 'Testing mass_create_reviews_v2()...';
    
    SELECT mass_create_reviews_v2(
        'parcel_review'::review_kind_v2,
        ARRAY[sample_parcel_id, sample_parcel_id_2],
        'Mass Created Review Test',
        (current_date + interval '30 days')::date,
        '{"test": "mass creation", "priority": "high"}'::jsonb
    ) INTO sample_review_ids;
    
    RAISE NOTICE 'Created % reviews with IDs: %', array_length(sample_review_ids, 1), sample_review_ids;
    
    -- ============================================================
    -- TEST 2: mass_assign_reviews_v2()
    -- ============================================================
    RAISE NOTICE 'Testing mass_assign_reviews_v2()...';
    
    PERFORM mass_assign_reviews_v2(sample_review_ids, sample_employee_id);
    RAISE NOTICE 'Assigned reviews % to employee %', sample_review_ids, sample_employee_id;
    
    -- ============================================================
    -- TEST 3: mass_update_review_status_v2()
    -- ============================================================
    RAISE NOTICE 'Testing mass_update_review_status_v2()...';
    
    PERFORM mass_update_review_status_v2(
        sample_review_ids, 
        'in-progress', 
        'Status updated via mass function test'
    );
    RAISE NOTICE 'Updated status of reviews % to in-progress', sample_review_ids;
    
    -- ============================================================
    -- TEST 4: get_employee_permissions_v2()
    -- ============================================================
    RAISE NOTICE 'Testing get_employee_permissions_v2()...';
    
    IF sample_employee_uuid IS NOT NULL THEN
        PERFORM get_employee_permissions_v2(sample_employee_uuid);
        RAISE NOTICE 'Retrieved permissions for UUID: %', sample_employee_uuid;
    ELSE
        RAISE NOTICE 'No employee UUID found for testing permissions';
    END IF;
    
    -- ============================================================
    -- TEST 5: get_parcel_summary_v2()
    -- ============================================================
    RAISE NOTICE 'Testing get_parcel_summary_v2()...';
    
    PERFORM get_parcel_summary_v2(sample_parcel_id);
    RAISE NOTICE 'Retrieved summary for parcel: %', sample_parcel_id;
    
    -- ============================================================
    -- TEST 6: get_parcel_as_of_date_v2()
    -- ============================================================
    RAISE NOTICE 'Testing get_parcel_as_of_date_v2()...';
    
    PERFORM get_parcel_as_of_date_v2(sample_parcel_id, (current_date - interval '6 months')::date);
    RAISE NOTICE 'Retrieved parcel data as of 6 months ago for parcel: %', sample_parcel_id;
    
    -- ============================================================
    -- TEST 7: get_buildings_as_of_date_v2()
    -- ============================================================
    RAISE NOTICE 'Testing get_buildings_as_of_date_v2()...';
    
    PERFORM get_buildings_as_of_date_v2(sample_parcel_id, (current_date - interval '1 year')::date);
    RAISE NOTICE 'Retrieved building data as of 1 year ago for parcel: %', sample_parcel_id;
    
    -- ============================================================
    -- TEST 8: get_land_as_of_date_v2()
    -- ============================================================
    RAISE NOTICE 'Testing get_land_as_of_date_v2()...';
    
    PERFORM get_land_as_of_date_v2(sample_parcel_id, (current_date - interval '1 year')::date);
    RAISE NOTICE 'Retrieved land data as of 1 year ago for parcel: %', sample_parcel_id;
    
    -- ============================================================
    -- TEST 9: get_complete_parcel_as_of_date_v2()
    -- ============================================================
    RAISE NOTICE 'Testing get_complete_parcel_as_of_date_v2()...';
    
    DECLARE
        complete_data jsonb;
        key_count integer;
    BEGIN
        SELECT get_complete_parcel_as_of_date_v2(sample_parcel_id, (current_date - interval '6 months')::date) INTO complete_data;
        SELECT count(*) INTO key_count FROM jsonb_object_keys(complete_data);
        RAISE NOTICE 'Retrieved complete parcel data with % top-level keys', key_count;
    END;
    
    -- ============================================================
    -- TEST 10: get_parcel_timeline_v2()
    -- ============================================================
    RAISE NOTICE 'Testing get_parcel_timeline_v2()...';
    
    PERFORM get_parcel_timeline_v2(
        sample_parcel_id, 
        (current_date - interval '2 years')::date, 
        current_date
    );
    RAISE NOTICE 'Retrieved timeline for parcel % over last 2 years', sample_parcel_id;
    
    RAISE NOTICE '============================================================';
    RAISE NOTICE 'ALL FUNCTION TESTS COMPLETED SUCCESSFULLY';
    RAISE NOTICE '============================================================';
END;
$$;

-- ============================================================
-- INDIVIDUAL FUNCTION CALL EXAMPLES
-- ============================================================

-- Example 1: Create reviews for multiple parcels
/*
SELECT mass_create_reviews_v2(
    'building_review'::review_kind_v2,
    ARRAY[1, 2, 3, 4, 5], -- Array of parcel IDs
    'Quarterly Building Assessment',
    (current_date + interval '60 days')::date,
    '{"quarter": "Q1", "year": 2026, "priority": "normal"}'::jsonb
);
*/

-- Example 2: Assign reviews to an employee
/*
SELECT mass_assign_reviews_v2(
    ARRAY[1, 2, 3], -- Array of review IDs
    1 -- Employee ID
);
*/

-- Example 3: Update multiple review statuses
/*
SELECT mass_update_review_status_v2(
    ARRAY[1, 2, 3], -- Array of review IDs
    'approved', -- New status slug
    'Batch approval after field verification'
);
*/

-- Example 4: Get employee permissions
/*
SELECT * FROM get_employee_permissions_v2('4be94f1c-078e-4810-8b6c-f2800a3c02f8'::uuid);
*/

-- Example 5: Get parcel summary
/*
SELECT * FROM get_parcel_summary_v2(1);
*/

-- Example 6: Get historical parcel data
/*
SELECT * FROM get_parcel_as_of_date_v2(1, '2025-06-01'::date);
*/

-- Example 7: Get historical building data
/*
SELECT * FROM get_buildings_as_of_date_v2(1, '2025-01-01'::date);
*/

-- Example 8: Get historical land data
/*
SELECT * FROM get_land_as_of_date_v2(1, '2025-01-01'::date);
*/

-- Example 9: Get complete parcel with all components as of date
/*
SELECT get_complete_parcel_as_of_date_v2(1, '2025-06-01'::date);
*/

-- Example 10: Get parcel change timeline
/*
SELECT * FROM get_parcel_timeline_v2(
    1, -- Parcel ID
    '2024-01-01'::date, -- Start date
    current_date -- End date
);
*/

-- ============================================================
-- VIEW EXAMPLES
-- ============================================================

-- Example: Query active reviews
/*
SELECT * FROM active_reviews_v2 
WHERE kind = 'building_review' 
AND days_until_due < 30
ORDER BY due_date ASC;
*/

-- Example: Query parcel overview
/*
SELECT * FROM parcel_overview_v2 
WHERE neighborhood = 'Downtown' 
AND building_count > 0
ORDER BY last_sale_date DESC NULLS LAST;
*/

-- ============================================================
-- TRIGGER TESTING
-- ============================================================

-- The following triggers are tested automatically when data changes:

-- 1. review_status_change_trigger_v2
-- Automatically logs status changes when reviews are updated:
/*
UPDATE public.reviews_v2 
SET current_status_id = (
    SELECT id FROM public.review_statuses_v2 
    WHERE review_kind = 'parcel_review' AND slug = 'approved' LIMIT 1
)
WHERE id = 1;

-- Check the log:
SELECT * FROM public.review_history_v2 WHERE review_id = 1 ORDER BY changed_at DESC;
*/

-- 2. employees_timestamp_trigger_v2
-- Automatically updates timestamp when employees are modified:
/*
UPDATE public.employees_v2 
SET status = 'inactive' 
WHERE id = 1;

-- The updated_at field will be automatically updated
SELECT first_name, last_name, status, updated_at FROM public.employees_v2 WHERE id = 1;
*/

-- 3. create_snapshots_trigger_v2
-- Automatically creates snapshots when reviews are completed:
/*
UPDATE public.reviews_v2 
SET completed_at = now() 
WHERE id = 1;

-- Check for automatically created snapshots:
SELECT * FROM public.parcel_snapshots_v2 WHERE review_id = 1;
SELECT * FROM public.building_snapshots_v2 WHERE review_id = 1;
SELECT * FROM public.land_snapshots_v2 WHERE review_id = 1;
*/

-- ============================================================
-- PERFORMANCE TESTING EXAMPLES
-- ============================================================

-- Test mass operations performance
/*
\timing on

-- Create 1000 reviews at once
SELECT mass_create_reviews_v2(
    'parcel_review'::review_kind_v2,
    (SELECT array_agg(id) FROM public.parcels_v2 LIMIT 1000),
    'Mass Performance Test',
    (current_date + interval '90 days')::date,
    '{"test": "performance", "batch_size": 1000}'::jsonb
);

-- Assign all to one employee
SELECT mass_assign_reviews_v2(
    (SELECT array_agg(id) FROM public.reviews_v2 WHERE title = 'Mass Performance Test'),
    1
);

-- Update all statuses
SELECT mass_update_review_status_v2(
    (SELECT array_agg(id) FROM public.reviews_v2 WHERE title = 'Mass Performance Test'),
    'in-progress',
    'Performance test batch processing'
);

\timing off
*/

-- ============================================================
-- END EXAMPLE-DB-FUNCTION-CALLS.SQL
-- ============================================================-- ============================================================
-- VALUE AND USE MANAGEMENT EXAMPLES
-- ============================================================

-- Example 11: Schedule value recalculation for a building
/*
SELECT schedule_value_recalculation_v2(
    'building', -- entity type
    1, -- building ID
    1, -- assessment cycle ID
    'immediate', -- trigger type
    NULL, -- scheduled date
    '{"square_footage": {"old_value": "2000", "new_value": "2200"}}'
);
*/

-- Example 12: Get current parcel values breakdown
/*
SELECT * FROM get_parcel_current_values_v2(1);
*/

-- Example 13: Detect value-triggering changes
/*
SELECT detect_value_triggering_changes_v2(
    'building',
    '{"square_footage": 2000, "condition_rating": 8}'::jsonb,
    '{"square_footage": 2200, "condition_rating": 9}'::jsonb
);
*/