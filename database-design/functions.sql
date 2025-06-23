drop function if exists get_parcel_owners(p_parcel_id INTEGER);
CREATE OR REPLACE FUNCTION get_parcel_owners(p_parcel_id INTEGER)
RETURNS TABLE (
    owner_id INTEGER,
    owner_name TEXT,
    ownership_type TEXT,
    is_primary BOOLEAN,
    start_date DATE,
    end_date DATE
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        o.id,
        o.name,
        po.ownership_type,
        po.is_primary,
        po.start_date,
        po.end_date
    FROM parcel_ownerships po
    JOIN owners o ON po.owner_id = o.id
    WHERE po.parcel_id = p_parcel_id
    ORDER BY po.start_date DESC;
END;
$$ LANGUAGE plpgsql;

SELECT get_parcel_owners(1); -- Example usage of the function


drop function if exists get_parcel_cost_values(p_parcel_id INTEGER);
CREATE OR REPLACE FUNCTION get_parcel_cost_values(p_parcel_id INTEGER)
RETURNS TABLE (
    value_id INTEGER,
    parcel_id INTEGER,
    for_tax_year INTEGER,
    created_at TIMESTAMP,
    status TEXT,
    status_effective_date DATE,
    status_notes TEXT,
    land_value INTEGER,
    building_value INTEGER,
    depreciation_amount INTEGER,
    total_value INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        pv.id,
        pv.parcel_id,
        pv.for_tax_year,
        pv.created_at,
        pvs.status,
        pvs.effective_date,
        pvs.notes,
        pvc.land_value,
        pvc.building_value,
        pvc.depreciation_amount,
        pvc.total_value
    FROM parcel_value_cost pvc
    JOIN parcel_values pv ON pvc.id = pv.id
    JOIN parcel_value_status pvs ON pvs.parcel_value_id = pv.id
    WHERE pv.parcel_id = p_parcel_id
    ORDER BY pv.for_tax_year DESC, pvs.effective_date DESC;
END;
$$ LANGUAGE plpgsql;
SELECT get_parcel_cost_values(1); -- Example usage of the function
