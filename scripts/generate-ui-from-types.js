#!/usr/bin/env node

/**
 * Database Types UI Generator
 *
 * Generates Next.js CRUD UI based on database-types.ts from Supabase
 * Uses shadcn/ui components and follows the devnet-reviews pattern
 *
 * Usage:
 *   node scripts/generate-ui-from-types.js [options]
 *
 * Options:
 *   --table=name              Generate for a single table
 *   --tables=table1,table2    Generate for specific tables
 *   --function=name           Generate for a single function
 *   --functions=func1,func2   Generate for specific functions
 *   --all                     Generate for all tables and functions
 *   --force                   Overwrite existing files
 *   --dry-run                 Show what would be generated
 *   --output-dir=path         Custom output directory (default: app)
 *
 * Examples:
 *   node scripts/generate-ui-from-types.js --table devnet_reviews
 *   node scripts/generate-ui-from-types.js --tables=users,posts --force
 *   node scripts/generate-ui-from-types.js --all
 */

const fs = require("fs");
const path = require("path");

// ============================================================
// CLI ARGUMENT PARSING
// ============================================================

const args = process.argv.slice(2);

// Helper to parse argument with both = and space syntax
function getArgValue(argName) {
  // Try --arg=value format
  const withEquals = args.find((arg) => arg.startsWith(`--${argName}=`));
  if (withEquals) {
    return withEquals.split("=")[1];
  }

  // Try --arg value format
  const argIndex = args.indexOf(`--${argName}`);
  if (argIndex !== -1 && argIndex + 1 < args.length) {
    const nextArg = args[argIndex + 1];
    // Make sure next arg is not another flag
    if (!nextArg.startsWith("--")) {
      return nextArg;
    }
  }

  return null;
}

// Parse table arguments (both singular and plural)
const singleTable = getArgValue("table");
const multipleTables = getArgValue("tables")?.split(",");

// Parse function arguments (both singular and plural)
const singleFunction = getArgValue("function");
const multipleFunctions = getArgValue("functions")?.split(",");

const options = {
  force: args.includes("--force"),
  dryRun: args.includes("--dry-run"),
  all: args.includes("--all"),
  tables: [...(singleTable ? [singleTable] : []), ...(multipleTables || [])],
  functions: [
    ...(singleFunction ? [singleFunction] : []),
    ...(multipleFunctions || []),
  ],
  outputDir: getArgValue("output-dir") || "app",
};

// Validate that at least one generation target is specified
if (
  !options.all &&
  options.tables.length === 0 &&
  options.functions.length === 0
) {
  console.error("❌ Error: You must specify what to generate");
  console.log("\nUsage:");
  console.log("  --table=name              Generate for a single table");
  console.log("  --tables=table1,table2    Generate for multiple tables");
  console.log("  --function=name           Generate for a single function");
  console.log("  --functions=func1,func2   Generate for multiple functions");
  console.log(
    "  --all                     Generate for all tables and functions"
  );
  console.log("\nExamples:");
  console.log(
    "  node scripts/generate-ui-from-types.js --table devnet_reviews"
  );
  console.log("  node scripts/generate-ui-from-types.js --tables=users,posts");
  console.log("  node scripts/generate-ui-from-types.js --all");
  process.exit(1);
}

const typesFilePath = path.resolve(process.cwd(), "database-types.ts");
const configFilePath = path.resolve(process.cwd(), "generate-ui-config.json");

if (!fs.existsSync(typesFilePath)) {
  console.error(`Error: database-types.ts not found at ${typesFilePath}`);
  console.log("Run 'npm run gen:types' to generate it first.");
  process.exit(1);
}

// Load config if it exists
let config = { global: {}, tables: {} };
if (fs.existsSync(configFilePath)) {
  try {
    config = JSON.parse(fs.readFileSync(configFilePath, "utf8"));
    console.log("📋 Loaded config from generate-ui-config.json");
  } catch (error) {
    console.warn("⚠️  Failed to parse config file, using defaults");
  }
}

// ============================================================
// TYPESCRIPT TYPES PARSER
// ============================================================

class DatabaseTypesParser {
  constructor(typesContent) {
    this.typesContent = typesContent;
    this.enums = [];
    this.tables = [];
    this.functions = [];
  }

  parse() {
    this.parseEnums();
    this.parseTables();
    this.parseFunctions();
    return {
      enums: this.enums,
      tables: this.tables,
      functions: this.functions,
    };
  }

  parseEnums() {
    // Find Enums section
    const enumsMatch = this.typesContent.match(
      /Enums:\s*\{([\s\S]*?)\n\s{4}\}/
    );
    if (!enumsMatch) return;

    const enumsSection = enumsMatch[1];

    // Match each enum definition
    const enumLines = enumsSection.split("\n").filter((line) => line.trim());
    let currentEnum = null;

    for (const line of enumLines) {
      const enumNameMatch = line.match(/^\s+(\w+):/);
      if (enumNameMatch) {
        if (currentEnum) {
          this.enums.push(currentEnum);
        }
        currentEnum = {
          name: enumNameMatch[1],
          values: [],
        };
      } else if (currentEnum) {
        const valueMatch = line.match(/"([^"]+)"/g);
        if (valueMatch) {
          currentEnum.values.push(
            ...valueMatch.map((v) => v.replace(/"/g, ""))
          );
        }
      }
    }

    if (currentEnum && currentEnum.values.length > 0) {
      this.enums.push(currentEnum);
    }
  }

  parseTables() {
    // Find Tables section
    const tablesMatch = this.typesContent.match(
      /Tables:\s*\{([\s\S]*?)(?=\n\s{4}Views:|Functions:|Enums:|\n\s{2}\})/
    );
    if (!tablesMatch) return;

    const tablesSection = tablesMatch[1];

    // Match each table - look for table name at 6-space indentation followed by Row definition
    const tableRegex =
      /\n\s{6}(\w+):\s*\{\s*\n\s{8}Row:\s*\{([\s\S]*?)\n\s{8}\}/g;
    let match;

    while ((match = tableRegex.exec(tablesSection)) !== null) {
      const tableName = match[1];
      const rowSection = match[2];

      const columns = [];
      const columnLines = rowSection.split("\n").filter((line) => line.trim());

      for (const line of columnLines) {
        const colMatch = line.match(/(\w+):\s*(.*)/);
        if (colMatch) {
          const name = colMatch[1];
          let type = colMatch[2].trim();
          const nullable = type.includes("| null");
          type = type.replace(/\s*\|\s*null/, "");

          // Detect enum types
          const enumMatch = type.match(
            /Database\["public"\]\["Enums"\]\["(\w+)"\]/
          );
          const enumType = enumMatch ? enumMatch[1] : null;

          columns.push({
            name,
            type: enumType ? "enum" : this.mapTypeScriptTypeToInternal(type),
            tsType: type,
            enumType,
            nullable,
            isPrimary: name === "id",
            isGenerated:
              name === "id" || name === "created_at" || name === "updated_at",
          });
        }
      }

      this.tables.push({ name: tableName, columns });
    }
  }

  parseFunctions() {
    // Find Functions section
    const functionsMatch = this.typesContent.match(
      /Functions:\s*\{([\s\S]*?)(?=\n\s{4}Enums:|\n\s{2}\})/
    );
    if (!functionsMatch) return;

    const functionsSection = functionsMatch[1];

    // Match each function
    const functionRegex =
      /(\w+):\s*\{[\s\S]*?Args:\s*\{([^}]*)\}[\s\S]*?Returns:\s*([\s\S]*?)(?=\n\s{6}\})/g;
    let match;

    while ((match = functionRegex.exec(functionsSection)) !== null) {
      const name = match[1];
      const argsSection = match[2];
      const returnsSection = match[3];

      // Parse parameters
      const parameters = [];
      const paramLines = argsSection.split("\n").filter((line) => line.trim());

      for (const line of paramLines) {
        const paramMatch = line.match(/(\w+)\??:\s*([\w\[\]<>|\s]+)/);
        if (paramMatch) {
          const paramName = paramMatch[1];
          const paramType = paramMatch[2].trim();
          const optional = line.includes(`${paramName}?:`);

          parameters.push({
            name: paramName,
            type: paramType,
            tsType: paramType,
            nullable: optional,
            optional,
          });
        }
      }

      // Determine return type
      const returnsArray = returnsSection.includes("[]");
      const returnsTable = returnsArray && returnsSection.includes("{");

      // Parse return columns if it's a table
      const returnColumns = [];
      if (returnsTable) {
        const returnMatch = returnsSection.match(/\{([\s\S]*?)\}/);
        if (returnMatch) {
          const returnLines = returnMatch[1]
            .split("\n")
            .filter((line) => line.trim());
          for (const line of returnLines) {
            const colMatch = line.match(/(\w+):\s*([\w\[\]|]+)/);
            if (colMatch) {
              returnColumns.push({
                name: colMatch[1],
                type: colMatch[2].trim(),
              });
            }
          }
        }
      }

      // Classify function
      const isMutation =
        name.startsWith("create_") ||
        name.startsWith("update_") ||
        name.startsWith("delete_") ||
        name.startsWith("insert_") ||
        name.startsWith("assign_") ||
        name.startsWith("approve_") ||
        name.startsWith("reject_") ||
        name.startsWith("complete_") ||
        name.includes("_update_") ||
        name.includes("_delete_");

      this.functions.push({
        name,
        parameters,
        returnType: returnsSection.trim(),
        returnsTable,
        returnColumns,
        isMutation,
        isQuery: !isMutation,
      });
    }
  }

  mapTypeScriptTypeToInternal(tsType) {
    if (tsType.includes("[]")) return "array";
    if (tsType === "string") return "string";
    if (tsType === "number") return "number";
    if (tsType === "boolean") return "boolean";
    if (tsType === "Json") return "object";
    if (tsType.includes("Database")) return "enum";
    return "string";
  }
}

// ============================================================
// FILE WRITER
// ============================================================

class FileWriter {
  constructor(options) {
    this.options = options;
  }

  write(filePath, content) {
    if (this.options.dryRun) {
      console.log(`[DRY RUN] Would create: ${filePath}`);
      return;
    }

    if (!this.options.force && fs.existsSync(filePath)) {
      console.log(`[SKIP] File exists: ${filePath}`);
      return;
    }

    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, content, "utf8");
    console.log(`[CREATE] ${filePath}`);
  }
}

// ============================================================
// STRING HELPERS
// ============================================================

function toPascalCase(str) {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

function toCamelCase(str) {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function toKebabCase(str) {
  return str.replace(/_/g, "-");
}

function toTitleCase(str) {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// ============================================================
// UI GENERATOR
// ============================================================

class UIGenerator {
  constructor(schema, options, config) {
    this.schema = schema;
    this.options = options;
    this.config = config;
    this.writer = new FileWriter(options);
  }

  getTableConfig(tableName) {
    return this.config.tables?.[tableName] || {};
  }

  getEnumType(table, fieldName) {
    if (!table || !table.name) return null;
    const tableConfig = this.getTableConfig(table.name);
    const fieldConfig = tableConfig.forms?.create?.fields?.find(
      (f) => f.name === fieldName
    );
    return fieldConfig?.enumType;
  }

  generate() {
    console.log("\n🚀 Generating UI components...\n");

    // Determine which tables to generate
    const tablesToGenerate = this.options.all
      ? this.schema.tables
      : this.schema.tables.filter((t) => this.options.tables.includes(t.name));

    // Validate that all specified tables exist
    if (this.options.tables.length > 0 && !this.options.all) {
      const missingTables = this.options.tables.filter(
        (name) => !this.schema.tables.find((t) => t.name === name)
      );
      if (missingTables.length > 0) {
        console.error(
          `❌ Error: Tables not found: ${missingTables.join(", ")}`
        );
        console.log("\nAvailable tables:");
        this.schema.tables.forEach((t) => console.log(`  - ${t.name}`));
        process.exit(1);
      }
    }

    // Generate for tables
    if (tablesToGenerate.length > 0) {
      console.log(
        `📋 Generating UI for ${tablesToGenerate.length} table(s)...`
      );
      for (const table of tablesToGenerate) {
        this.generateTableUI(table);
      }
    }

    // Determine which functions to generate
    const functionsToGenerate = this.options.all
      ? this.schema.functions
      : this.schema.functions.filter((f) =>
          this.options.functions.includes(f.name)
        );

    // Validate that all specified functions exist
    if (this.options.functions.length > 0 && !this.options.all) {
      const missingFunctions = this.options.functions.filter(
        (name) => !this.schema.functions.find((f) => f.name === name)
      );
      if (missingFunctions.length > 0) {
        console.error(
          `❌ Error: Functions not found: ${missingFunctions.join(", ")}`
        );
        console.log("\nAvailable functions:");
        this.schema.functions.forEach((f) => console.log(`  - ${f.name}`));
        process.exit(1);
      }
    }

    // Generate for functions
    if (functionsToGenerate.length > 0) {
      console.log(
        `⚡ Generating UI for ${functionsToGenerate.length} function(s)...`
      );
      for (const func of functionsToGenerate) {
        this.generateFunctionUI(func);
      }
    }

    if (tablesToGenerate.length === 0 && functionsToGenerate.length === 0) {
      console.log("⚠️  No matching tables or functions found to generate.");
    }
  }

  generateTableUI(table) {
    const routeName = toKebabCase(table.name);
    const basePath = path.join(this.options.outputDir, routeName);

    console.log(`\n📦 Generating UI for table: ${table.name}`);

    // types.ts
    this.writer.write(
      path.join(basePath, "types.ts"),
      this.generateTableTypes(table)
    );

    // actions.ts
    this.writer.write(
      path.join(basePath, "actions.ts"),
      this.generateTableActions(table)
    );

    // page.tsx
    this.writer.write(
      path.join(basePath, "page.tsx"),
      this.generateTablePage(table)
    );

    // loading.tsx
    this.writer.write(
      path.join(basePath, "loading.tsx"),
      this.generateLoadingPage()
    );

    // filters.tsx
    this.writer.write(
      path.join(basePath, "filters.tsx"),
      this.generateFiltersComponent(table)
    );

    // api/route.ts
    this.writer.write(
      path.join(basePath, "api", "route.ts"),
      this.generateApiRoute(table)
    );

    // [id]/page.tsx
    this.writer.write(
      path.join(basePath, "[id]", "page.tsx"),
      this.generateDetailsPage(table)
    );

    // data/server.tsx
    this.writer.write(
      path.join(basePath, "data", `${routeName}-server.tsx`),
      this.generateServerDataComponent(table)
    );

    // data/client.tsx
    this.writer.write(
      path.join(basePath, "data", `${routeName}-client.tsx`),
      this.generateClientDataComponent(table)
    );

    // data/presentation.tsx
    this.writer.write(
      path.join(basePath, `${routeName}-presentation.tsx`),
      this.generatePresentationComponent(table)
    );

    // pagination.tsx
    this.writer.write(
      path.join(basePath, `${routeName}-pagination.tsx`),
      this.generatePaginationComponent(table)
    );
  }

  generateFunctionUI(func) {
    const routeName = toKebabCase(func.name);
    const basePath = path.join(this.options.outputDir, routeName);

    console.log(`\n⚡ Generating UI for function: ${func.name}`);

    // types.ts
    this.writer.write(
      path.join(basePath, "types.ts"),
      this.generateFunctionTypes(func)
    );

    // actions.ts
    this.writer.write(
      path.join(basePath, "actions.ts"),
      this.generateFunctionActions(func)
    );

    // page.tsx
    this.writer.write(
      path.join(basePath, "page.tsx"),
      this.generateFunctionPage(func)
    );

    // parameters-form.tsx
    this.writer.write(
      path.join(basePath, "parameters-form.tsx"),
      this.generateParametersForm(func)
    );

    // api/route.ts
    this.writer.write(
      path.join(basePath, "api", "route.ts"),
      this.generateFunctionApiRoute(func)
    );

    // data/server.tsx (for functions that return tables)
    if (func.returnsTable) {
      this.writer.write(
        path.join(basePath, "data", `${routeName}-server.tsx`),
        this.generateFunctionServerDataComponent(func)
      );

      // data/client.tsx
      this.writer.write(
        path.join(basePath, "data", `${routeName}-client.tsx`),
        this.generateFunctionClientDataComponent(func)
      );

      // presentation.tsx
      this.writer.write(
        path.join(basePath, `${routeName}-presentation.tsx`),
        this.generateFunctionPresentationComponent(func)
      );

      // pagination.tsx
      this.writer.write(
        path.join(basePath, `${routeName}-pagination.tsx`),
        this.generateFunctionPaginationComponent(func)
      );
    }
  }

  // ============================================================
  // TABLE GENERATORS
  // ============================================================

  generateTableTypes(table) {
    const interfaceName = toPascalCase(table.name);

    return `// Type exports from database-types.ts
import type { Database } from "@/database-types";

export type ${interfaceName} = Database["public"]["Tables"]["${table.name}"]["Row"];
export type ${interfaceName}Insert = Database["public"]["Tables"]["${table.name}"]["Insert"];
export type ${interfaceName}Update = Database["public"]["Tables"]["${table.name}"]["Update"];
`;
  }

  generateTableActions(table) {
    const interfaceName = toPascalCase(table.name);
    const tableName = table.name;

    // Auto-detect enums used in this table
    const enumTypes = new Set();
    table.columns.forEach((col) => {
      const enumType = this.getEnumType(table, col.name);
      if (enumType) {
        enumTypes.add(enumType);
      }
    });

    const enumImports = Array.from(enumTypes)
      .map(
        (e) => `type ${toPascalCase(e)} = Database["public"]["Enums"]["${e}"];`
      )
      .join("\n");

    return `"use server";

import { revalidatePath as rp } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/database-types";

type ${interfaceName} = Database["public"]["Tables"]["${tableName}"]["Row"];
type ${interfaceName}Insert = Database["public"]["Tables"]["${tableName}"]["Insert"];
type ${interfaceName}Update = Database["public"]["Tables"]["${tableName}"]["Update"];
${enumImports ? enumImports + "\n" : ""}

export async function create${interfaceName}(
  prevState: { error: string; success: string },
  formData: FormData
): Promise<{ error: string; success: string }> {
  try {
    const supabase = await createClient();
    
    const data: ${interfaceName}Insert = {
${table.columns
  .filter((col) => !col.isGenerated && !col.isPrimary)
  .map((col) => this.generateFormDataExtraction(col))
  .filter(Boolean)
  .join("\n")}
    };

    const { error } = await supabase
      .from("${tableName}")
      .insert(data);

    if (error) {
      return { error: error.message, success: "" };
    }

    const revalidatePath = formData.get("revalidate_path") as string;
    if (revalidatePath) rp(revalidatePath);

    return { error: "", success: "Created successfully" };
  } catch (err: any) {
    return { error: err.message || "Failed to create record", success: "" };
  }
}

export async function update${interfaceName}(
  id: number,
  prevState: { error: string; success: string },
  formData: FormData
): Promise<{ error: string; success: string }> {
  try {
    const supabase = await createClient();
    
    const data: ${interfaceName}Update = {
${table.columns
  .filter((col) => !col.isGenerated && !col.isPrimary)
  .map((col) => this.generateFormDataExtraction(col))
  .filter(Boolean)
  .join("\n")}
    };

    const { error } = await supabase
      .from("${tableName}")
      .update(data)
      .eq("id", id);

    if (error) {
      return { error: error.message, success: "" };
    }

    const revalidatePath = formData.get("revalidate_path") as string;
    if (revalidatePath) rp(revalidatePath);

    return { error: "", success: "Updated successfully" };
  } catch (err: any) {
    return { error: err.message || "Failed to update record", success: "" };
  }
}

export async function delete${interfaceName}(
  id: number
): Promise<{ error: string; success: string }> {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from("${tableName}")
      .delete()
      .eq("id", id);

    if (error) {
      return { error: error.message, success: "" };
    }

    return { error: "", success: "Deleted successfully" };
  } catch (err: any) {
    return { error: err.message || "Failed to delete record", success: "" };
  }
}

export async function get${interfaceName}ById(
  id: number
): Promise<${interfaceName} | null> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("${tableName}")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return null;
    }

    return data as ${interfaceName};
  } catch (err) {
    return null;
  }
}
`;
  }

  generateFormDataExtraction(col, table) {
    const fieldName = col.name;
    // First check column's enumType, then check config
    const enumType = col.enumType || this.getEnumType(table, fieldName);

    // Skip timestamps
    if (fieldName === "created_at" || fieldName === "updated_at") {
      return null;
    }

    if (col.type === "boolean") {
      return `      ${fieldName}: formData.get("${fieldName}") === "true" || formData.get("${fieldName}") === "on",`;
    } else if (enumType) {
      const enumTypeName = toPascalCase(enumType);
      return `      ${fieldName}: (formData.get("${fieldName}") as ${enumTypeName})${col.nullable ? " || undefined" : ""},`;
    } else if (col.type === "array") {
      return `      ${fieldName}: formData.get("${fieldName}") ? (formData.get("${fieldName}") as string).split(",").map(s => s.trim()) : [],`;
    } else if (col.type === "object") {
      return `      ${fieldName}: formData.get("${fieldName}") ? JSON.parse(formData.get("${fieldName}") as string) : ${col.nullable ? "undefined" : "{}"},`;
    } else if (col.nullable) {
      if (col.type === "number") {
        return `      ${fieldName}: formData.get("${fieldName}") ? Number(formData.get("${fieldName}")) : undefined,`;
      } else {
        return `      ${fieldName}: (formData.get("${fieldName}") as string) || undefined,`;
      }
    } else {
      if (col.type === "number") {
        return `      ${fieldName}: Number(formData.get("${fieldName}")),`;
      } else {
        return `      ${fieldName}: formData.get("${fieldName}") as string,`;
      }
    }
  }

  generateTablePage(table) {
    const interfaceName = toPascalCase(table.name);
    const title = toTitleCase(table.name);
    const routeName = toKebabCase(table.name);

    return `import { Suspense } from "react";
import { ${interfaceName}Server } from "./data/${routeName}-server";
import { ${interfaceName}Filters } from "./filters";
import { Skeleton } from "@/components/ui/skeleton";

function LoadingState() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

interface ${interfaceName}PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ${interfaceName}Page({
  searchParams,
}: ${interfaceName}PageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const pageSize = 25;
  
  // Extract filters from search params
  const filters: any = {};
  // Add filter mapping based on your table columns
  // Example: if (params.status) filters.status = params.status as string;
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">${title}</h1>
        <p className="text-muted-foreground">
          Manage ${title.toLowerCase()} records
        </p>
      </div>
      
      <div className="flex gap-4">
        <${interfaceName}Filters />
      </div>

      <Suspense key={currentPage} fallback={<LoadingState />}>
        <${interfaceName}Server 
          filters={filters} 
          currentPage={currentPage}
          pageSize={pageSize}
        />
      </Suspense>
    </div>
  );
}
`;
  }

  generateLoadingPage() {
    return `import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
`;
  }

  generateTableComponent(table) {
    const interfaceName = toPascalCase(table.name);
    const routeName = toKebabCase(table.name);
    const displayColumns = table.columns
      .filter((col) => col.type !== "object" && !col.name.includes("_data"))
      .slice(0, 6);

    return `"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Trash } from "lucide-react";
import Link from "next/link";
import type { Database } from "@/database-types";
import { delete${interfaceName} } from "./actions";
import { toast } from "sonner";

type ${interfaceName} = Database["public"]["Tables"]["${table.name}"]["Row"];

interface ${interfaceName}TableProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export function ${interfaceName}Table({ searchParams }: ${interfaceName}TableProps) {
  const [data, setData] = useState<${interfaceName}[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("page_size", "25");
        
        Object.entries(searchParams).forEach(([key, value]) => {
          if (value) params.set(key, String(value));
        });

        const response = await fetch(\`/${routeName}/api?\${params.toString()}\`);
        const result = await response.json();

        if (result.error) {
          toast.error(result.error);
        } else {
          setData(result.data || []);
          setTotal(result.total || 0);
          setTotalPages(result.totalPages || 1);
        }
      } catch (error) {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [searchParams, page]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;

    const result = await delete${interfaceName}(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.success);
      setPage(page); // Refresh
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Records ({total})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="p-3 text-left font-medium">ID</th>
${displayColumns.map((col) => `                <th className="p-3 text-left font-medium">${toTitleCase(col.name)}</th>`).join("\n")}
                <th className="p-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={${displayColumns.length + 2}} className="p-8 text-center text-muted-foreground">
                    No records found
                  </td>
                </tr>
              ) : (
                data.map((record) => (
                  <tr key={record.id} className="border-b hover:bg-muted/50">
                    <td className="p-3">{record.id}</td>
${displayColumns
  .map(
    (col) => `                    <td className="p-3">
                      {record.${col.name} != null ? String(record.${col.name}) : "—"}
                    </td>`
  )
  .join("\n")}
                    <td className="p-3">
                      <div className="flex justify-end gap-2">
                        <Link href={\`/${routeName}/\${record.id}\`}>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(record.id!)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
`;
  }

  generateFiltersComponent(table) {
    const interfaceName = toPascalCase(table.name);
    const filterColumns = table.columns
      .filter((col) => col.type === "string" && !col.name.endsWith("_id"))
      .slice(0, 3);

    return `"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Filter, X } from "lucide-react";
import { useState } from "react";

export function ${interfaceName}Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams();

    formData.forEach((value, key) => {
      if (value) params.set(key, value.toString());
    });

    router.push(\`?\${params.toString()}\`);
    setOpen(false);
  };

  const handleClear = () => {
    router.push(window.location.pathname);
    setOpen(false);
  };

  const hasFilters = Array.from(searchParams.keys()).length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={hasFilters ? "default" : "outline"}>
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {hasFilters && (
            <span className="ml-2 bg-background text-foreground rounded-full px-2 py-0.5 text-xs">
              {Array.from(searchParams.keys()).length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filter Records</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
${filterColumns
  .map(
    (col) => `          <div>
            <Label htmlFor="${col.name}">${toTitleCase(col.name)}</Label>
            <Input
              id="${col.name}"
              name="${col.name}"
              defaultValue={searchParams.get("${col.name}") || ""}
              placeholder="Filter by ${col.name.replace(/_/g, " ")}..."
            />
          </div>`
  )
  .join("\n")}

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={handleClear}>
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
            <Button type="submit">Apply Filters</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
`;
  }

  generateApiRoute(table) {
    const tableName = table.name;

    return `import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("page_size") || "25");
    
    const supabase = await createClient();

    let query = supabase
      .from("${tableName}")
      .select("*", { count: "exact" });

${table.columns
  .filter((col) => col.type === "string" && !col.name.endsWith("_id"))
  .slice(0, 3)
  .map(
    (col) => `    const ${col.name} = searchParams.get("${col.name}");
    if (${col.name}) {
      query = query.ilike("${col.name}", \`%\${${col.name}}%\`);
    }
`
  )
  .join("\n")}

    const { data, error, count } = await query
      .range((page - 1) * pageSize, page * pageSize - 1)
      .order("id", { ascending: false });

    if (error) {
      return Response.json({ error: "Database query failed" }, { status: 500 });
    }

    return Response.json({
      data,
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    });
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
`;
  }

  generateDetailsPage(table) {
    const interfaceName = toPascalCase(table.name);
    const title = toTitleCase(table.name);
    const routeName = toKebabCase(table.name);

    return `import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { get${interfaceName}ById } from "../actions";

interface ${interfaceName}DetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function ${interfaceName}DetailsPage({
  params,
}: ${interfaceName}DetailsPageProps) {
  const { id } = await params;
  const record = await get${interfaceName}ById(parseInt(id));

  if (!record) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/${routeName}">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            ${title} Details
          </h1>
          <p className="text-muted-foreground">ID: {record.id}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
${table.columns
  .filter((col) => col.type !== "object")
  .map(
    (col) => `            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                ${toTitleCase(col.name)}
              </dt>
              <dd className="mt-1 text-sm">
                {record.${col.name} != null ? String(record.${col.name}) : "—"}
              </dd>
            </div>`
  )
  .join("\n")}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
`;
  }

  generateServerDataComponent(table) {
    const interfaceName = toPascalCase(table.name);
    const tableName = table.name;
    const routeName = toKebabCase(table.name);

    // Get filterable columns (string, enum types)
    const filterableColumns = table.columns.filter(
      (col) =>
        (col.type === "string" || col.type === "enum") &&
        !col.isPrimary &&
        col.name !== "created_at" &&
        col.name !== "updated_at"
    );

    // Collect enum types for imports
    const enumTypes = new Set();
    filterableColumns.forEach((col) => {
      if (col.enumType) {
        enumTypes.add(col.enumType);
      }
    });

    const enumImports = Array.from(enumTypes)
      .map(
        (e) => `type ${toPascalCase(e)} = Database["public"]["Enums"]["${e}"];`
      )
      .join("\n");

    const filterInterface = filterableColumns
      .map((col) => {
        const typeName = col.enumType ? toPascalCase(col.enumType) : "string";
        return `  ${col.name}?: ${typeName};`;
      })
      .join("\n");

    const filterConditions = filterableColumns
      .map(
        (col) => `  if (filters?.${col.name}) {
    dataQuery = dataQuery.eq("${col.name}", filters.${col.name});
  }`
      )
      .join("\n\n");

    const countFilterConditions = filterableColumns
      .map(
        (col) => `  if (filters?.${col.name}) {
    countQuery = countQuery.eq("${col.name}", filters.${col.name});
  }`
      )
      .join("\n\n");

    return `import { createClient } from "@/lib/supabase/server";
import { ${interfaceName}Presentation } from "../${routeName}-presentation";
import { ${interfaceName}Pagination } from "../${routeName}-pagination";
import type { Database } from "@/database-types";
${enumImports ? "\n" + enumImports + "\n" : ""}
interface ${interfaceName}ServerProps {
  filters?: {
${filterInterface}
  };
  currentPage?: number;
  pageSize?: number;
}

export async function ${interfaceName}Server({
  filters,
  currentPage = 1,
  pageSize = 25,
}: ${interfaceName}ServerProps) {
  const supabase = await createClient();

  // Build query for data
  let dataQuery = supabase.from("${tableName}").select("*");
  
  // Build query for count
  let countQuery = supabase.from("${tableName}").select("*", { count: "exact", head: true });

  // Apply filters to data query
${filterConditions}

  // Apply filters to count query
${countFilterConditions}

  // Apply pagination to data query
  const offset = (currentPage - 1) * pageSize;
  dataQuery = dataQuery.range(offset, offset + pageSize - 1);

  const [{ data, error }, { count }] = await Promise.all([
    dataQuery,
    countQuery,
  ]);

  const totalPages = count ? Math.ceil(count / pageSize) : 0;

  return (
    <>
      <${interfaceName}Presentation
        data={data || []}
        error={error?.message}
      />
      <${interfaceName}Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </>
  );
}
`;
  }

  generateClientDataComponent(table) {
    const interfaceName = toPascalCase(table.name);
    const routeName = toKebabCase(table.name);

    // Get filterable columns
    const filterableColumns = table.columns.filter(
      (col) =>
        (col.type === "string" || col.type === "enum") &&
        !col.isPrimary &&
        col.name !== "created_at" &&
        col.name !== "updated_at"
    );

    // Collect enum types for imports
    const enumTypes = new Set();
    filterableColumns.forEach((col) => {
      if (col.enumType) {
        enumTypes.add(col.enumType);
      }
    });

    const enumImports = Array.from(enumTypes)
      .map(
        (e) => `type ${toPascalCase(e)} = Database["public"]["Enums"]["${e}"];`
      )
      .join("\n");

    const filterInterface = filterableColumns
      .map((col) => {
        const typeName = col.enumType ? toPascalCase(col.enumType) : "string";
        return `  ${col.name}?: ${typeName};`;
      })
      .join("\n");

    const filterParams = filterableColumns
      .map(
        (col) =>
          `  if (filters?.${col.name}) params.append("${col.name}", filters.${col.name});`
      )
      .join("\n");

    return `"use client";

import useSWR from "swr";
import { ${interfaceName}Presentation } from "../${routeName}-presentation";
import type { Database } from "@/database-types";
${enumImports ? "\n" + enumImports + "\n" : ""}
interface ${interfaceName}ClientProps {
  filters?: {
${filterInterface}
  };
  limit?: number;
  offset?: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function ${interfaceName}Client({
  filters,
  limit = 25,
  offset = 0,
}: ${interfaceName}ClientProps) {
  const params = new URLSearchParams();

  // Apply filters
${filterParams}

  // Apply pagination
  params.append("limit", limit.toString());
  params.append("offset", offset.toString());

  const { data, error, isLoading } = useSWR(
    \`/api/${routeName}?\${params.toString()}\`,
    fetcher
  );

  return (
    <${interfaceName}Presentation
      data={data || []}
      error={error?.message}
      isLoading={isLoading}
    />
  );
}
`;
  }

  generatePresentationComponent(table) {
    const interfaceName = toPascalCase(table.name);
    const title = toTitleCase(table.name);

    // Get display columns (first 5 non-object columns)
    const displayColumns = table.columns
      .filter((col) => col.type !== "object" && !col.name.includes("_data"))
      .slice(0, 5);

    const tableHeaders = displayColumns
      .map(
        (col) =>
          `<th className="px-4 py-2 text-left">${toTitleCase(col.name)}</th>`
      )
      .join("");

    const tableCells = displayColumns
      .map((col) => {
        if (col.type === "boolean") {
          return `<td className="px-4 py-2">{item.${col.name} ? "Yes" : "No"}</td>`;
        } else if (col.type === "date") {
          return `<td className="px-4 py-2">{item.${col.name} ? new Date(item.${col.name}).toLocaleDateString() : "-"}</td>`;
        } else {
          return `<td className="px-4 py-2">{item.${col.name} || "-"}</td>`;
        }
      })
      .join("");

    const cardFields = displayColumns
      .map((col) => {
        const label = toTitleCase(col.name);
        if (col.type === "boolean") {
          return `<div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-muted-foreground">${label}:</span>
                  <span>{item.${col.name} ? "Yes" : "No"}</span>
                </div>`;
        } else if (col.type === "date") {
          return `<div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-muted-foreground">${label}:</span>
                  <span>{item.${col.name} ? new Date(item.${col.name}).toLocaleDateString() : "-"}</span>
                </div>`;
        } else {
          return `<div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-muted-foreground">${label}:</span>
                  <span>{item.${col.name} || "-"}</span>
                </div>`;
        }
      })
      .join("");

    return `"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Table } from "lucide-react";
import type { ${interfaceName} } from "./types";

interface ${interfaceName}PresentationProps {
  data: ${interfaceName}[];
  error?: string;
  isLoading?: boolean;
}

export function ${interfaceName}Presentation({
  data,
  error,
  isLoading,
}: ${interfaceName}PresentationProps) {
  const [view, setView] = useState<"table" | "card">("table");

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-red-500">Error: {error}</div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-muted-foreground">No ${title.toLowerCase()} found</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* View Toggle */}
      <div className="flex justify-end gap-2">
        <Button
          variant={view === "table" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("table")}
        >
          <Table className="h-4 w-4 mr-2" />
          Table
        </Button>
        <Button
          variant={view === "card" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("card")}
        >
          <LayoutGrid className="h-4 w-4 mr-2" />
          Cards
        </Button>
      </div>

      {/* Table View */}
      {view === "table" && (
        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
${tableHeaders}
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
${tableCells}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {data.length} {data.length === 1 ? "record" : "records"}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Card View */}
      {view === "card" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((item, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="text-sm font-semibold">
                  ${title} #{index + 1}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
${cardFields}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
`;
  }

  generatePaginationComponent(table) {
    const interfaceName = toPascalCase(table.name);

    return `"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ${interfaceName}PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function ${interfaceName}Pagination({
  currentPage,
  totalPages,
}: ${interfaceName}PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return \`\${pathname}?\${params.toString()}\`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push(createPageURL(currentPage - 1))}
        disabled={currentPage <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      <div className="flex items-center gap-2">
        {currentPage > 2 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(createPageURL(1))}
            >
              1
            </Button>
            {currentPage > 3 && <span className="px-2">...</span>}
          </>
        )}

        {currentPage > 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(createPageURL(currentPage - 1))}
          >
            {currentPage - 1}
          </Button>
        )}

        <Button variant="default" size="sm">
          {currentPage}
        </Button>

        {currentPage < totalPages && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(createPageURL(currentPage + 1))}
          >
            {currentPage + 1}
          </Button>
        )}

        {currentPage < totalPages - 1 && (
          <>
            {currentPage < totalPages - 2 && <span className="px-2">...</span>}
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(createPageURL(totalPages))}
            >
              {totalPages}
            </Button>
          </>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push(createPageURL(currentPage + 1))}
        disabled={currentPage >= totalPages}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
`;
  }

  // ============================================================
  // FUNCTION GENERATORS
  // ============================================================

  generateFunctionTypes(func) {
    const interfaceName = toPascalCase(func.name);

    // Check if any parameter or return column uses Json type
    const usesJsonType =
      func.parameters.some((param) => param.type === "Json") ||
      func.returnColumns.some((col) => col.type === "Json");

    const jsonImport = usesJsonType
      ? '\nimport type { Json } from "@/database-types";'
      : "";

    return `// Generated types for ${func.name} function
import type { Database } from "@/database-types";${jsonImport}

export interface ${interfaceName}Params {
${func.parameters.map((p) => `  ${p.name}${p.optional ? "?" : ""}: ${p.type};`).join("\n")}
}

export interface ${interfaceName}Result {
${
  func.returnColumns.length > 0
    ? func.returnColumns.map((col) => `  ${col.name}: ${col.type};`).join("\n")
    : "  [key: string]: any;"
}
}`;
  }

  generateFunctionActions(func) {
    const interfaceName = toPascalCase(func.name);
    const isPaginated = func.returnsTable && func.isQuery;

    return `"use server";

import { createClient } from "@/lib/supabase/server";
import { ${interfaceName}Params, ${interfaceName}Result } from "./types";

export async function execute${interfaceName}(
  prevState: { error: string; success: string },
  formData: FormData
): Promise<{ error: string; success: string; data?: ${interfaceName}Result[]${isPaginated ? "; totalCount?: number" : ""} }> {
  try {
    const supabase = await createClient();

    const params: any = {
${func.parameters
  .map((p) => {
    if (p.type === "boolean") {
      return `      ${p.name}: formData.get("${p.name}") === "true",`;
    } else if (p.type === "number") {
      return `      ${p.name}: formData.get("${p.name}") ? Number(formData.get("${p.name}")) : undefined,`;
    } else if (p.type === "Json") {
      return `      ${p.name}: formData.get("${p.name}") ? JSON.parse(formData.get("${p.name}") as string) : undefined,`;
    } else {
      return `      ${p.name}: formData.get("${p.name}") || undefined,`;
    }
  })
  .join("\n")}
    };

    ${
      isPaginated
        ? `// Add pagination
    const page = formData.get("page") ? Number(formData.get("page")) : 1;
    const pageSize = formData.get("page_size") ? Number(formData.get("page_size")) : 25;
    if (params.p_filters) {
      params.p_filters = { ...params.p_filters, page, page_size: pageSize };
    }`
        : ""
    }

    const { data, error } = await supabase.rpc("${func.name}", params);

    if (error) {
      return { error: error.message, success: "" };
    }

    ${
      isPaginated
        ? 'return { error: "", success: "", data, totalCount: Array.isArray(data) ? data.length : 0 };'
        : 'return { error: "", success: "Operation completed", data };'
    }
  } catch (error: any) {
    return { error: error.message || "An error occurred", success: "" };
  }
}
`;
  }

  generateFunctionPage(func) {
    const interfaceName = toPascalCase(func.name);
    const routeName = toKebabCase(func.name);
    const hasServerComponent = func.returnsTable;

    return `import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ParametersForm } from "./parameters-form";
${hasServerComponent ? `import { ${interfaceName}Server } from "./data/${routeName}-server";` : ""}

interface ${interfaceName}PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ${interfaceName}Page({ searchParams }: ${interfaceName}PageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>${toTitleCase(func.name)}</CardTitle>
          <CardDescription>
            Execute the ${func.name} database function
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ParametersForm />
        </CardContent>
      </Card>

      ${
        hasServerComponent
          ? `{/* Results Section */}
      <${interfaceName}Server params={params} currentPage={currentPage} />`
          : ""
      }
    </div>
  );
}
`;
  }

  generateParametersForm(func) {
    const interfaceName = toPascalCase(func.name);

    return `"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function ParametersForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const params = new URLSearchParams();
      
      // Add form values to URL params
      ${func.parameters
        .map(
          (p) => `      const ${p.name} = formData.get("${p.name}") as string;
      if (${p.name}) params.set("${p.name}", ${p.name});`
        )
        .join("\n")}

      // Navigate with search params to trigger server component refresh
      router.push(\`?\${params.toString()}\`);
      
      ${func.returnsTable ? "" : "toast.success('Function executed successfully');"}
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
${func.parameters
  .map(
    (p) => `      <div>
        <Label htmlFor="${p.name}">${toTitleCase(p.name)}</Label>
        <Input
          id="${p.name}"
          name="${p.name}"
          type="${p.type === "number" ? "number" : p.type === "boolean" ? "checkbox" : "text"}"
          ${!p.optional ? "required" : ""}
        />
      </div>`
  )
  .join("\n")}
      
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "${func.isMutation ? "Executing" : "Searching"}..." : "${func.isMutation ? "Execute" : "Search"}"}
      </Button>
    </form>
  );
}
`;
  }

  generateResultsTable(func) {
    const interfaceName = toPascalCase(func.name);

    return `"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ${interfaceName}Result } from "./types";

interface ResultsTableProps {
  results: ${interfaceName}Result[];
}

export function ResultsTable({ results }: ResultsTableProps) {
  if (results.length === 0) {
    return <p className="text-muted-foreground">No results found.</p>;
  }

  const columns = Object.keys(results[0]);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col}>
                {col.replace(/_/g, " ").replace(/\\b\\w/g, (l) => l.toUpperCase())}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((row, idx) => (
            <TableRow key={idx}>
              {columns.map((col) => (
                <TableCell key={col}>
                  {typeof row[col] === "object"
                    ? JSON.stringify(row[col])
                    : String(row[col] ?? "")}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
`;
  }

  generateFunctionApiRoute(func) {
    const funcName = func.name;
    const interfaceName = toPascalCase(func.name);

    // Build parameter extraction from query params
    const paramExtraction = func.parameters
      .map((p) => {
        if (p.type === "boolean") {
          return `    const ${p.name} = searchParams.get("${p.name}") === "true";`;
        } else if (p.type === "number") {
          return `    const ${p.name} = searchParams.get("${p.name}") ? Number(searchParams.get("${p.name}")) : undefined;`;
        } else if (p.type === "Json") {
          return `    const ${p.name}Raw = searchParams.get("${p.name}");
    const ${p.name} = ${p.name}Raw ? JSON.parse(${p.name}Raw) : undefined;`;
        } else {
          return `    const ${p.name} = searchParams.get("${p.name}") || undefined;`;
        }
      })
      .join("\n");

    // Build params object
    const paramsObj =
      func.parameters.length > 0
        ? `{\n${func.parameters.map((p) => `      ${p.name}`).join(",\n")}\n    }`
        : "{}";

    return `import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
${paramExtraction}

    const supabase = await createClient();

    const { data, error } = await supabase.rpc("${funcName}", ${paramsObj});

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({
      data,
      success: true,
    });
  } catch (error: any) {
    return Response.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
`;
  }

  generateFunctionServerDataComponent(func) {
    const interfaceName = toPascalCase(func.name);
    const functionName = func.name;
    const routeName = toKebabCase(func.name);

    const paramInterface = func.parameters
      .map((param) => `  ${param.name}?: ${param.type};`)
      .join("\n");

    const paramArgs = func.parameters
      .map((param) => `      ${param.name}: params?.${param.name},`)
      .join("\n");

    // Check if any parameter uses Json type
    const usesJsonType = func.parameters.some((param) => param.type === "Json");
    const jsonImport = usesJsonType
      ? '\nimport type { Json } from "@/database-types";'
      : "";

    return `import { createClient } from "@/lib/supabase/server";
import { ${interfaceName}Presentation } from "../${routeName}-presentation";
import { ${interfaceName}Pagination } from "../${routeName}-pagination";${jsonImport}

interface ${interfaceName}ServerProps {
  params?: {
${paramInterface}
  };
  currentPage?: number;
  pageSize?: number;
}

export async function ${interfaceName}Server({
  params,
  currentPage = 1,
  pageSize = 25,
}: ${interfaceName}ServerProps) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("${functionName}", {
${paramArgs}
  });

  // Handle pagination in-memory if data is returned
  let paginatedData = data || [];
  let totalCount = paginatedData.length;
  
  if (data && data.length > 0) {
    const offset = (currentPage - 1) * pageSize;
    paginatedData = data.slice(offset, offset + pageSize);
  }

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <>
      <${interfaceName}Presentation
        data={paginatedData}
        error={error?.message}
      />
      <${interfaceName}Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </>
  );
}
`;
  }

  generateFunctionClientDataComponent(func) {
    const interfaceName = toPascalCase(func.name);
    const routeName = toKebabCase(func.name);

    const paramInterface = func.parameters
      .map((param) => `  ${param.name}?: ${param.type};`)
      .join("\\n");

    const paramUrlParams = func.parameters
      .map(
        (param) =>
          `  if (params?.${param.name}) urlParams.append("${param.name}", String(params.${param.name}));`
      )
      .join("\\n");

    // Check if any parameter uses Json type
    const usesJsonType = func.parameters.some((param) => param.type === "Json");
    const jsonImport = usesJsonType
      ? '\nimport type { Json } from "@/database-types";'
      : "";

    return `"use client";

import useSWR from "swr";${jsonImport}
import { ${interfaceName}Presentation } from "../${routeName}-presentation";

interface ${interfaceName}ClientProps {
  params?: {
${paramInterface}
  };
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function ${interfaceName}Client({
  params,
}: ${interfaceName}ClientProps) {
  const urlParams = new URLSearchParams();

${paramUrlParams}

  const { data, error, isLoading } = useSWR(
    \`/${routeName}/api?\${urlParams.toString()}\`,
    fetcher
  );

  return (
    <${interfaceName}Presentation
      data={data || []}
      error={error?.message}
      isLoading={isLoading}
    />
  );
}
`;
  }

  generateFunctionPresentationComponent(func) {
    const interfaceName = toPascalCase(func.name);
    const title = toTitleCase(func.name);

    // Get display columns from return type
    const displayColumns = func.returnColumns.slice(0, 5);

    const tableHeaders = displayColumns
      .map(
        (col) =>
          `<th className="px-4 py-2 text-left">${toTitleCase(col.name)}</th>`
      )
      .join("");

    const tableCells = displayColumns
      .map((col) => {
        if (col.type === "boolean") {
          return `<td className="px-4 py-2">{item.${col.name} ? "Yes" : "No"}</td>`;
        } else if (col.type === "date") {
          return `<td className="px-4 py-2">{item.${col.name} ? new Date(item.${col.name}).toLocaleDateString() : "-"}</td>`;
        } else {
          return `<td className="px-4 py-2">{item.${col.name} || "-"}</td>`;
        }
      })
      .join("");

    const cardFields = displayColumns
      .map((col) => {
        const label = toTitleCase(col.name);
        if (col.type === "boolean") {
          return `<div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-muted-foreground">${label}:</span>
                  <span>{item.${col.name} ? "Yes" : "No"}</span>
                </div>`;
        } else if (col.type === "date") {
          return `<div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-muted-foreground">${label}:</span>
                  <span>{item.${col.name} ? new Date(item.${col.name}).toLocaleDateString() : "-"}</span>
                </div>`;
        } else {
          return `<div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-muted-foreground">${label}:</span>
                  <span>{item.${col.name} || "-"}</span>
                </div>`;
        }
      })
      .join("");

    return `"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Table } from "lucide-react";

interface ${interfaceName}PresentationProps {
  data: any[];
  error?: string;
  isLoading?: boolean;
}

export function ${interfaceName}Presentation({
  data,
  error,
  isLoading,
}: ${interfaceName}PresentationProps) {
  const [view, setView] = useState<"table" | "card">("table");

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-red-500">Error: {error}</div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-muted-foreground">No results found</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* View Toggle */}
      <div className="flex justify-end gap-2">
        <Button
          variant={view === "table" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("table")}
        >
          <Table className="h-4 w-4 mr-2" />
          Table
        </Button>
        <Button
          variant={view === "card" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("card")}
        >
          <LayoutGrid className="h-4 w-4 mr-2" />
          Cards
        </Button>
      </div>

      {/* Table View */}
      {view === "table" && (
        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
${tableHeaders}
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
${tableCells}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {data.length} {data.length === 1 ? "result" : "results"}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Card View */}
      {view === "card" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((item, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="text-sm font-semibold">
                  Result #{index + 1}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
${cardFields}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
`;
  }

  generateFunctionPaginationComponent(func) {
    const interfaceName = toPascalCase(func.name);

    return `"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ${interfaceName}PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function ${interfaceName}Pagination({
  currentPage,
  totalPages,
}: ${interfaceName}PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return \`\${pathname}?\${params.toString()}\`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push(createPageURL(currentPage - 1))}
        disabled={currentPage <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      <div className="flex items-center gap-2">
        {currentPage > 2 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(createPageURL(1))}
            >
              1
            </Button>
            {currentPage > 3 && <span className="px-2">...</span>}
          </>
        )}

        {currentPage > 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(createPageURL(currentPage - 1))}
          >
            {currentPage - 1}
          </Button>
        )}

        <Button variant="default" size="sm">
          {currentPage}
        </Button>

        {currentPage < totalPages && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(createPageURL(currentPage + 1))}
          >
            {currentPage + 1}
          </Button>
        )}

        {currentPage < totalPages - 1 && (
          <>
            {currentPage < totalPages - 2 && <span className="px-2">...</span>}
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(createPageURL(totalPages))}
            >
              {totalPages}
            </Button>
          </>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push(createPageURL(currentPage + 1))}
        disabled={currentPage >= totalPages}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
`;
  }
}

// ============================================================
// MAIN EXECUTION
// ============================================================

try {
  console.log(`📖 Reading types from: ${typesFilePath}`);
  const typesContent = fs.readFileSync(typesFilePath, "utf8");

  console.log("🔍 Parsing database types...");
  const parser = new DatabaseTypesParser(typesContent);
  const schema = parser.parse();

  console.log(`\n✅ Found:`);
  console.log(`   ${schema.tables.length} tables`);
  console.log(`   ${schema.enums.length} enums`);
  console.log(`   ${schema.functions.length} functions`);

  const generator = new UIGenerator(schema, options, config);
  generator.generate();

  console.log("\n✨ Generation complete!\n");
} catch (error) {
  console.error("❌ Error:", error.message);
  console.error(error.stack);
  process.exit(1);
}
