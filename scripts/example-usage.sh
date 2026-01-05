#!/bin/bash

# Example usage script for the SQL Schema UI Generator
# This demonstrates common use cases

echo "=== SQL Schema UI Generator - Usage Examples ==="
echo ""

# Example 1: Dry run to preview what will be generated
echo "1. Preview generation (dry run):"
echo "   node scripts/generate-ui-from-schema.js database/schemas/devnet-schema.sql --dry-run"
echo ""

# Example 2: Generate for specific tables only
echo "2. Generate UI for specific tables:"
echo "   node scripts/generate-ui-from-schema.js database/schemas/devnet-schema.sql --tables=devnet_employees,devnet_sales"
echo ""

# Example 3: Generate for all tables
echo "3. Generate UI for all tables:"
echo "   node scripts/generate-ui-from-schema.js database/schemas/devnet-schema.sql"
echo ""

# Example 4: Force overwrite existing files
echo "4. Regenerate all files (overwrite existing):"
echo "   node scripts/generate-ui-from-schema.js database/schemas/devnet-schema.sql --force"
echo ""

# Example 5: Skip certain components
echo "5. Generate without API routes:"
echo "   node scripts/generate-ui-from-schema.js database/schemas/devnet-schema.sql --skip=api"
echo ""

# Example 6: Generate only components (no app routes)
echo "6. Generate only components:"
echo "   node scripts/generate-ui-from-schema.js database/schemas/devnet-schema.sql --skip=page,loading,types,actions,api,details"
echo ""

# Example 7: Custom output directory
echo "7. Generate to custom directory:"
echo "   node scripts/generate-ui-from-schema.js database/schemas/devnet-schema.sql --output-dir=src/app"
echo ""

echo "=== Interactive Example ==="
echo ""
read -p "Would you like to run a dry run now? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]
then
    node scripts/generate-ui-from-schema.js database/schemas/devnet-schema.sql --dry-run --tables=devnet_employees
fi
