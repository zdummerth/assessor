insert into
    public.structure_uses (slug, name, description, created_by)
values
    (
        'single_family',
        'Single Family',
        'Detached or attached single-family residential structure',
        '4be94f1c-078e-4810-8b6c-f2800a3c02f8'
    ),
    (
        'two_family',
        'Two-Family',
        'Duplex residential structure',
        '4be94f1c-078e-4810-8b6c-f2800a3c02f8'
    ),
    (
        'multi_family',
        'Multi-Family',
        'Residential structure with three or more dwelling units',
        '4be94f1c-078e-4810-8b6c-f2800a3c02f8'
    ),
    (
        'mixed_use',
        'Mixed Use',
        'Combination of residential and commercial uses',
        '4be94f1c-078e-4810-8b6c-f2800a3c02f8'
    ),
    (
        'commercial',
        'Commercial',
        'Retail, service, or general commercial use',
        '4be94f1c-078e-4810-8b6c-f2800a3c02f8'
    ),
    (
        'office',
        'Office',
        'Professional or administrative office use',
        '4be94f1c-078e-4810-8b6c-f2800a3c02f8'
    ),
    (
        'industrial',
        'Industrial',
        'Manufacturing, warehouse, or industrial use',
        '4be94f1c-078e-4810-8b6c-f2800a3c02f8'
    ),
    (
        'agricultural',
        'Agricultural',
        'Agricultural or farm-related structure',
        '4be94f1c-078e-4810-8b6c-f2800a3c02f8'
    ),
    (
        'institutional',
        'Institutional',
        'Schools, churches, hospitals, government buildings',
        '4be94f1c-078e-4810-8b6c-f2800a3c02f8'
    ),
    (
        'garage',
        'Garage',
        'Detached or accessory garage structure',
        '4be94f1c-078e-4810-8b6c-f2800a3c02f8'
    ),
    (
        'accessory',
        'Accessory',
        'Accessory structure such as shed or outbuilding',
        '4be94f1c-078e-4810-8b6c-f2800a3c02f8'
    ),
    (
        'concrete_pad',
        'Concrete Pad',
        'Concrete pad or foundation structure',
        '4be94f1c-078e-4810-8b6c-f2800a3c02f8'
    ),
    (
        'parking_lot',
        'Parking Lot',
        'Surface parking lot structure',
        '4be94f1c-078e-4810-8b6c-f2800a3c02f8'
    );

insert into
    public.structure_conditions (slug, name, description, sort_order, created_by)
values
    (
        'unsound',
        'Unsound',
        'Structure is unsafe or uninhabitable',
        10,
        '4be94f1c-078e-4810-8b6c-f2800a3c02f8'
    ),
    (
        'poor',
        'Poor',
        'Major deferred maintenance or structural issues',
        20,
        '4be94f1c-078e-4810-8b6c-f2800a3c02f8'
    ),
    (
        'fair',
        'Fair',
        'Noticeable wear and functional deficiencies',
        30,
        '4be94f1c-078e-4810-8b6c-f2800a3c02f8'
    ),
    (
        'average',
        'Average',
        'Typical condition for age with normal wear',
        40,
        '4be94f1c-078e-4810-8b6c-f2800a3c02f8'
    ),
    (
        'good',
        'Good',
        'Well maintained with minimal deficiencies',
        50,
        '4be94f1c-078e-4810-8b6c-f2800a3c02f8'
    ),
    (
        'very_good',
        'Very Good',
        'Above average condition with recent updates',
        60,
        '4be94f1c-078e-4810-8b6c-f2800a3c02f8'
    ),
    (
        'excellent',
        'Excellent',
        'Like-new condition or fully renovated',
        70,
        '4be94f1c-078e-4810-8b6c-f2800a3c02f8'
    );

insert into
    public.structure_section_types (slug, name, description)
values
    (
        'basement_finished',
        'Basement (Finished)',
        'Finished basement living area',
        '4be94f1c-078e-4810-8b6c-f2800a3c02f8'
    ),
    (
        'basement_unfinished',
        'Basement (Unfinished)',
        'Unfinished basement area',
        '4be94f1c-078e-4810-8b6c-f2800a3c02f8'
    ),
    (
        'crawl_space',
        'Crawl Space',
        'Crawl space foundation area',
        '4be94f1c-078e-4810-8b6c-f2800a3c02f8'
    ),
    (
        'main_floor',
        'Main Floor',
        'Primary finished floor',
        '4be94f1c-078e-4810-8b6c-f2800a3c02f8'
    ),
    (
        'upper_floor',
        'Upper Floor',
        'Finished floor above main level',
        '4be94f1c-078e-4810-8b6c-f2800a3c02f8'
    ),
    (
        'attic_finished',
        'Attic (Finished)',
        'Finished attic living area',
        '4be94f1c-078e-4810-8b6c-f2800a3c02f8'
    ),
    (
        'attic_unfinished',
        'Attic (Unfinished)',
        'Unfinished attic space',
        '4be94f1c-078e-4810-8b6c-f2800a3c02f8'
    ),
    (
        'addition',
        'Addition',
        'Finished or unfinished building addition',
        '4be94f1c-078e-4810-8b6c-f2800a3c02f8'
    ),
    (
        'garage_attached',
        'Garage (Attached)',
        'Attached garage area',
        '4be94f1c-078e-4810-8b6c-f2800a3c02f8'
    ),
    (
        'garage_detached',
        'Garage (Detached)',
        'Detached garage structure',
        '4be94f1c-078e-4810-8b6c-f2800a3c02f8'
    ),
    (
        'porch',
        'Porch',
        'Covered or uncovered porch area',
        '4be94f1c-078e-4810-8b6c-f2800a3c02f8'
    ),
    (
        'deck',
        'Deck',
        'Exterior deck',
        '4be94f1c-078e-4810-8b6c-f2800a3c02f8'
    ),
    (
        'commercial_floor',
        'Commercial Floor',
        'Finished commercial floor area',
        '4be94f1c-078e-4810-8b6c-f2800a3c02f8'
    ),
    (
        'mezzanine',
        'Mezzanine',
        'Intermediate or mezzanine level',
        '4be94f1c-078e-4810-8b6c-f2800a3c02f8'
    );