#!/usr/bin/env node

/**
 * Generate Server Component Architecture from Database Function Types
 *
 * Creates a complete folder structure with:
 * - page.tsx (server component with data fetching)
 * - search.tsx (client component with filters)
 * - table.tsx (server component displaying results)
 * - pagination.tsx (client component for pagination)
 * - table-skeleton.tsx (loading state)
 */

const fs = require("fs");
const path = require("path");

const DATABASE_TYPES_PATH = path.join(__dirname, "..", "database-types.ts");
const APP_DIR = path.join(__dirname, "..", "app");

/**
 * Parse database-types.ts to extract all function definitions
 */
function parseFunctionDefinitions(typesContent) {
  const functions = [];

  const functionsMatch = typesContent.match(
    /Functions:\s*\{([\s\S]*?)(?=\n\s{4}\}[\s\S]*?Enums:)/
  );
  if (!functionsMatch) {
    throw new Error("Could not find Functions section in database-types.ts");
  }

  const functionsSection = functionsMatch[1];
  const lines = functionsSection.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();
    const funcMatch = line.match(/^(\w+):\s*\{$/);

    if (funcMatch) {
      const functionName = funcMatch[1];
      i++;

      while (i < lines.length && !lines[i].includes("Args:")) {
        i++;
      }

      if (i >= lines.length) break;

      const args = [];
      i++;

      while (i < lines.length) {
        const argLine = lines[i].trim();
        if (argLine === "};" || argLine === "}") break;

        const argMatch = argLine.match(/^(\w+)(\?)?:\s*([^;]+);?$/);
        if (argMatch) {
          const [, name, optional, type] = argMatch;
          args.push({
            name,
            type: type.trim(),
            optional: !!optional,
          });
        }

        i++;
      }

      functions.push({ name: functionName, args });
    }

    i++;
  }

  return functions;
}

/**
 * Convert snake_case to PascalCase
 */
function toPascalCase(str) {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

/**
 * Convert snake_case to camelCase
 */
function toCamelCase(str) {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/**
 * Convert p_param_name to paramName
 */
function toParamName(name) {
  return toCamelCase(name.replace(/^p_/, ""));
}

/**
 * Get TypeScript type for parameter
 */
function getTsType(type) {
  if (type === "number" || type === "number[]") return "number";
  if (type === "boolean" || type === "boolean[]") return "boolean";
  return "string";
}

/**
 * Generate conversion code for parameter
 */
function getConversion(paramName, type) {
  if (type === "number") return `Number(params?.${paramName})`;
  if (type === "number[]")
    return `params?.${paramName}?.split(',').map(Number)`;
  if (type === "boolean") return `params?.${paramName} === 'true'`;
  if (type === "boolean[]")
    return `params?.${paramName}?.split(',').map(v => v === 'true')`;
  if (type === "string[]") return `params?.${paramName}?.split(',')`;
  return `params?.${paramName}`;
}

/**
 * Generate input type for search form
 */
function getInputType(type) {
  if (type === "number" || type === "number[]") return "number";
  if (type === "boolean" || type === "boolean[]") return "checkbox";
  return "text";
}

/**
 * Generate page.tsx content
 */
function generatePageContent(functionName, args) {
  const pascalName = toPascalCase(functionName);

  const searchParamsType =
    args.length > 0
      ? `{
    ${args
      .map((arg) => {
        const paramName = toParamName(arg.name);
        return `${paramName}?: string;`;
      })
      .join("\n    ")}
    page?: string;
  }`
      : "{}";

  const paramExtractions = args
    .map((arg) => {
      const paramName = toParamName(arg.name);
      const conversion = getConversion(paramName, arg.type);
      const defaultValue = arg.optional ? " || undefined" : "";
      return `  const ${paramName} = ${conversion}${defaultValue};`;
    })
    .join("\n");

  return `import { Suspense } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import ${pascalName}Search from "./${functionName}-search";
import ${pascalName}Table from "./${functionName}-table";
import ${pascalName}Pagination from "./${functionName}-pagination";
import { TableSkeleton } from "./table-skeleton";

export default async function ${pascalName}Page({
  searchParams,
}: {
  searchParams?: Promise<${searchParamsType}>;
}) {
  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;
${paramExtractions}

  return (
    <div className="w-full space-y-6">
      <Card className="border-2 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b pb-6">
          <CardTitle className="text-2xl">${pascalName.replace(/([A-Z])/g, " $1").trim()}</CardTitle>
        </CardHeader>
        
        <div className="p-6 space-y-6">
          <${pascalName}Search ${args
            .map((arg) => {
              const paramName = toParamName(arg.name);
              return `default${toPascalCase(paramName)}={${paramName}}`;
            })
            .join(" ")} />

          <Suspense key={currentPage + JSON.stringify(params)} fallback={<TableSkeleton />}>
            <${pascalName}Table
              ${args
                .map((arg) => {
                  const paramName = toParamName(arg.name);
                  return `${paramName}={${paramName}}`;
                })
                .join("\n              ")}
              currentPage={currentPage}
            />
          </Suspense>

          <${pascalName}Pagination />
        </div>
      </Card>
    </div>
  );
}
`;
}

/**
 * Generate search.tsx content
 */
function generateSearchContent(functionName, args) {
  const pascalName = toPascalCase(functionName);

  const propsType = args
    .map((arg) => {
      const paramName = toParamName(arg.name);
      const tsType = getTsType(arg.type);
      return `  default${toPascalCase(paramName)}?: ${tsType};`;
    })
    .join("\n");

  const localState = args
    .map((arg) => {
      const paramName = toParamName(arg.name);
      const tsType = getTsType(arg.type);
      return `  const [local${toPascalCase(paramName)}, setLocal${toPascalCase(paramName)}] = useState<${tsType} | string>(
    searchParams.get("${paramName}")?.toString() || default${toPascalCase(paramName)}?.toString() || ""
  );`;
    })
    .join("\n");

  const syncEffect = args
    .map((arg) => {
      const paramName = toParamName(arg.name);
      return `      setLocal${toPascalCase(paramName)}(
        searchParams.get("${paramName}")?.toString() || default${toPascalCase(paramName)}?.toString() || ""
      );`;
    })
    .join("\n");

  const hasChanges = args
    .map((arg) => {
      const paramName = toParamName(arg.name);
      return `local${toPascalCase(paramName)} !== (searchParams.get("${paramName}")?.toString() || default${toPascalCase(paramName)}?.toString() || "")`;
    })
    .join(" ||\n    ");

  const applyFilters = args
    .map((arg) => {
      const paramName = toParamName(arg.name);
      return `    if (local${toPascalCase(paramName)}) {
      params.set("${paramName}", local${toPascalCase(paramName)}.toString());
    } else {
      params.delete("${paramName}");
    }`;
    })
    .join("\n");

  const inputFields = args
    .map((arg) => {
      const paramName = toParamName(arg.name);
      const inputType = getInputType(arg.type);
      const label = arg.name
        .replace(/^p_/, "")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());

      if (inputType === "checkbox") {
        return `        <div className="flex items-center space-x-2">
          <input
            id="${paramName}"
            type="checkbox"
            checked={local${toPascalCase(paramName)} === 'true'}
            onChange={(e) => setLocal${toPascalCase(paramName)}(e.target.checked.toString())}
            className="h-4 w-4 rounded border-gray-300"
          />
          <label htmlFor="${paramName}" className="text-sm font-medium">
            ${label}
          </label>
        </div>`;
      }

      return `        <div className="space-y-2">
          <label htmlFor="${paramName}" className="text-sm font-medium">
            ${label}
          </label>
          <input
            id="${paramName}"
            type="${inputType}"
            value={local${toPascalCase(paramName)}}
            onChange={(e) => setLocal${toPascalCase(paramName)}(e.target.value)}
            placeholder="${label}"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>`;
    })
    .join("\n\n");

  return `"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ${pascalName}SearchProps {
${propsType}
}

export default function ${pascalName}Search({
  ${args.map((arg) => `default${toPascalCase(toParamName(arg.name))}`).join(",\n  ")},
}: ${pascalName}SearchProps) {
  const searchParams = useSearchParams();
  const { push } = useRouter();
  const pathname = usePathname();
  const [isApplying, setIsApplying] = useState(false);

${localState}

  // Sync local state with URL params
  useEffect(() => {
${syncEffect}
    setIsApplying(false);
  }, [searchParams${args.map((arg) => `, default${toPascalCase(toParamName(arg.name))}`).join("")}]);

  // Check if local state differs from URL params
  const hasChanges = ${hasChanges};

  const handleApply = () => {
    setIsApplying(true);
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

${applyFilters}

    push(\`\${pathname}?\${params.toString()}\`);
  };

  const handleReset = () => {
    push(pathname);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
${inputFields}
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleApply}
          disabled={!hasChanges || isApplying}
          className="min-w-[100px]"
        >
          {isApplying ? "Applying..." : "Apply Filters"}
        </Button>
        <Button onClick={handleReset} variant="outline">
          Reset
        </Button>
      </div>
    </div>
  );
}
`;
}

/**
 * Generate table.tsx content
 */
function generateTableContent(functionName, args) {
  const pascalName = toPascalCase(functionName);

  const propsInterface = args
    .map((arg) => {
      const paramName = toParamName(arg.name);
      const tsType = getTsType(arg.type);
      const optional = arg.optional ? "?" : "";
      return `  ${paramName}${optional}: ${tsType}${arg.type.includes("[]") ? "[]" : ""};`;
    })
    .join("\n");

  const rpcParams = args
    .map((arg) => {
      const paramName = toParamName(arg.name);
      return `    if (${paramName} !== undefined) rpcParams.${arg.name} = ${paramName};`;
    })
    .join("\n");

  return `import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/database-types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ${pascalName}Result = Database["public"]["Functions"]["${functionName}"]["Returns"];
type ${pascalName}Args = Database["public"]["Functions"]["${functionName}"]["Args"];

interface ${pascalName}TableProps {
${propsInterface}
  currentPage: number;
}

export default async function ${pascalName}Table({
  ${args.map((arg) => toParamName(arg.name)).join(",\n  ")},
  currentPage,
}: ${pascalName}TableProps) {
  const supabase = await createClient();

  const rpcParams: Partial<${pascalName}Args> = {};
${rpcParams}

  const { data, error } = await supabase.rpc("${functionName}", rpcParams);

  if (error) {
    return (
      <div className="text-red-600 p-4 border border-red-300 rounded-md">
        Error loading data: {error.message}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-gray-500 p-4 text-center">
        No results found
      </div>
    );
  }

  // Get column names from first row
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col} className="font-semibold">
                {col.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row: any, idx: number) => (
            <TableRow key={idx}>
              {columns.map((col) => (
                <TableCell key={col}>
                  {row[col] != null ? String(row[col]) : '-'}
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

/**
 * Generate pagination.tsx content
 */
function generatePaginationContent(functionName) {
  const pascalName = toPascalCase(functionName);

  return `"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ${pascalName}Pagination() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { push } = useRouter();

  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return \`\${pathname}?\${params.toString()}\`;
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        onClick={() => push(createPageURL(currentPage - 1))}
        disabled={currentPage <= 1}
        variant="outline"
        size="sm"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      
      <span className="text-sm">
        Page {currentPage}
      </span>

      <Button
        onClick={() => push(createPageURL(currentPage + 1))}
        variant="outline"
        size="sm"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
`;
}

/**
 * Generate table-skeleton.tsx content
 */
function generateSkeletonContent() {
  return `export function TableSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-10 bg-gray-200 rounded animate-pulse" />
      <div className="h-10 bg-gray-100 rounded animate-pulse" />
      <div className="h-10 bg-gray-100 rounded animate-pulse" />
      <div className="h-10 bg-gray-100 rounded animate-pulse" />
      <div className="h-10 bg-gray-100 rounded animate-pulse" />
      <div className="h-10 bg-gray-100 rounded animate-pulse" />
    </div>
  );
}
`;
}

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  let functionName = null;
  let componentPath = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--function" || args[i] === "-f") {
      functionName = args[i + 1];
    }
    if (args[i] === "--path" || args[i] === "-p") {
      componentPath = args[i + 1];
    }
  }

  return { functionName, componentPath };
}

/**
 * Find function by name
 */
function findFunction(functions, functionName) {
  if (!functionName) {
    console.error("❌ Error: Function name is required");
    console.log(
      "\nUsage: npm run gen:component -- --function <function_name> [--path <relative_path>]"
    );
    console.log(
      "   or: npm run gen:component -- -f <function_name> [-p <relative_path>]"
    );
    console.log("\nAvailable functions:");
    functions.slice(0, 20).forEach((func) => {
      console.log(`  - ${func.name}`);
    });
    if (functions.length > 20) {
      console.log(`  ... and ${functions.length - 20} more`);
    }
    process.exit(1);
  }

  const func = functions.find((f) => f.name === functionName);

  if (!func) {
    const matches = functions.filter((f) =>
      f.name.toLowerCase().includes(functionName.toLowerCase())
    );

    if (matches.length === 0) {
      console.error(`❌ Error: Function "${functionName}" not found`);
      process.exit(1);
    }

    if (matches.length === 1) {
      return matches[0];
    }

    console.error(`❌ Error: Multiple functions match "${functionName}":`);
    matches.forEach((f) => console.log(`  - ${f.name}`));
    console.log("\nPlease specify the exact function name.");
    process.exit(1);
  }

  return func;
}

/**
 * Create component files
 */
function createComponents(functionName, args, componentPath) {
  const targetPath = componentPath || functionName.replace(/_/g, "-");
  const componentDir = path.join(APP_DIR, targetPath);
  const pascalName = toPascalCase(functionName);

  // Create directory
  if (!fs.existsSync(componentDir)) {
    fs.mkdirSync(componentDir, { recursive: true });
  }

  const files = [
    { name: "page.tsx", content: generatePageContent(functionName, args) },
    {
      name: `${functionName}-search.tsx`,
      content: generateSearchContent(functionName, args),
    },
    {
      name: `${functionName}-table.tsx`,
      content: generateTableContent(functionName, args),
    },
    {
      name: `${functionName}-pagination.tsx`,
      content: generatePaginationContent(functionName),
    },
    { name: "table-skeleton.tsx", content: generateSkeletonContent() },
  ];

  const createdFiles = [];

  for (const file of files) {
    const filePath = path.join(componentDir, file.name);
    fs.writeFileSync(filePath, file.content);
    createdFiles.push(filePath);
  }

  return { componentDir, createdFiles };
}

/**
 * Main execution
 */
async function main() {
  console.log("🚀 Component Generator\n");

  const { functionName, componentPath } = parseArgs();

  console.log("📖 Reading database-types.ts...");
  const typesContent = fs.readFileSync(DATABASE_TYPES_PATH, "utf8");

  console.log("🔍 Parsing function definitions...");
  const functions = parseFunctionDefinitions(typesContent);
  console.log(`✅ Found ${functions.length} functions`);

  const selectedFunction = findFunction(functions, functionName);
  console.log(`\n✨ Selected: ${selectedFunction.name}`);

  console.log("\n📋 Function Details:");
  console.log(`  Name: ${selectedFunction.name}`);
  console.log(`  Arguments (${selectedFunction.args.length}):`);
  selectedFunction.args.forEach((arg) => {
    const optional = arg.optional ? "(optional)" : "(required)";
    console.log(`    - ${arg.name}: ${arg.type} ${optional}`);
  });

  console.log("\n⚙️  Generating component files...");
  const { componentDir, createdFiles } = createComponents(
    selectedFunction.name,
    selectedFunction.args,
    componentPath
  );

  console.log(`\n✅ Components created successfully!`);
  console.log(`📁 Location: ${componentDir}`);
  console.log(`\n📝 Created files:`);
  createdFiles.forEach((file) => {
    console.log(`   - ${path.basename(file)}`);
  });

  const routePath = componentPath || selectedFunction.name.replace(/_/g, "-");
  console.log(`\n🌐 Page will be available at:`);
  console.log(`   /${routePath}`);
}

main().catch((error) => {
  console.error("❌ Error:", error.message);
  process.exit(1);
});
