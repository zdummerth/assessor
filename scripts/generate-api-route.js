#!/usr/bin/env node

/**
 * Generate API Route from Database Function Types
 *
 * This script parses database-types.ts, presents function definitions to the user,
 * and generates a complete API route file based on the selected function's Args and Returns types.
 */

const fs = require("fs");
const path = require("path");

const DATABASE_TYPES_PATH = path.join(__dirname, "..", "database-types.ts");
const APP_API_DIR = path.join(__dirname, "..", "app", "api");

/**
 * Parse database-types.ts to extract all function definitions
 * Looks for pattern: function_name: { Args: { ... }; Returns: ... };
 */
function parseFunctionDefinitions(typesContent) {
  const functions = [];

  // Find the Functions section: Database["public"]["Functions"]
  const functionsMatch = typesContent.match(
    /Functions:\s*\{([\s\S]*?)(?=\n\s{4}\}[\s\S]*?Enums:)/
  );
  if (!functionsMatch) {
    throw new Error("Could not find Functions section in database-types.ts");
  }

  const functionsSection = functionsMatch[1];

  // Parse each function definition
  // Pattern: function_name: { Args: { ... }; Returns: ... };
  const lines = functionsSection.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    // Look for function name line (ends with : {)
    const funcMatch = line.match(/^(\w+):\s*\{$/);
    if (funcMatch) {
      const functionName = funcMatch[1];
      i++;

      // Find Args block
      while (i < lines.length && !lines[i].includes("Args:")) {
        i++;
      }

      if (i >= lines.length) break;

      // Parse Args
      const args = [];
      i++; // Move past Args: {

      while (i < lines.length) {
        const argLine = lines[i].trim();

        // End of Args block
        if (argLine === "};" || argLine === "}") {
          break;
        }

        // Parse argument: p_name?: type;
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

      functions.push({
        name: functionName,
        args,
        returnsType: "unknown", // We don't need this for route generation
      });
    }

    i++;
  }

  return functions;
}

/**
 * Get the TypeScript type (preserves array notation for proper conversion)
 */
function getTypeValidator(type) {
  return type;
}

/**
 * Convert parameter name from snake_case to a readable format
 */
function formatParamName(name) {
  return name.replace(/^p_/, "").replace(/_/g, " ");
}

/**
 * Generate the route.ts file content
 */
function generateRouteContent(functionDef) {
  const { name, args } = functionDef;

  // Determine required parameters
  const requiredParams = args.filter((arg) => !arg.optional);
  const hasRequiredParams = requiredParams.length > 0;

  // Generate searchParams extraction
  const paramExtractions = args
    .map((arg) => {
      const paramName = arg.name.replace(/^p_/, "");
      return `  const ${paramName} = searchParams.get("${paramName}");`;
    })
    .join("\n");

  // Generate validation for required params
  const validationChecks = requiredParams
    .map((arg) => {
      const paramName = arg.name.replace(/^p_/, "");
      return `  if (!${paramName}) {
    return NextResponse.json(
      { error: "${paramName} parameter is required" },
      { status: 400 }
    );
  }`;
    })
    .join("\n\n");

  // Generate conversion helper function
  const getConversion = (paramName, type, includeCondition = true) => {
    const prefix = includeCondition ? "" : "";
    if (type === "number") {
      return `parseInt(${paramName})`;
    } else if (type === "number[]") {
      return `${paramName}.split(',').map(Number)`;
    } else if (type === "string[]") {
      return `${paramName}.split(',')`;
    } else if (type === "boolean[]") {
      return `${paramName}.split(',').map(v => v === 'true')`;
    } else if (type.includes("[]")) {
      return `${paramName}.split(',')`;
    } else if (type === "boolean") {
      return `${paramName} === 'true'`;
    } else {
      return paramName;
    }
  };

  // Build params initialization with required fields
  const requiredParamsInit = requiredParams
    .map((arg) => {
      const paramName = arg.name.replace(/^p_/, "");
      const type = getTypeValidator(arg.type);
      const conversion = getConversion(paramName, type, false);
      return `    ${arg.name}: ${conversion},`;
    })
    .join("\n");

  // Build optional params assignment
  const optionalParams = args.filter((arg) => arg.optional);
  const optionalParamsBuilding = optionalParams
    .map((arg) => {
      const paramName = arg.name.replace(/^p_/, "");
      const type = getTypeValidator(arg.type);
      const conversion = getConversion(paramName, type, false);
      return `  if (${paramName}) params.${arg.name} = ${conversion};`;
    })
    .join("\n");

  const paramsDeclaration = hasRequiredParams
    ? `  const params: ${toPascalCase(name)}Args = {
${requiredParamsInit}
  };`
    : `  const params: Partial<${toPascalCase(name)}Args> = {};`;

  return `import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { Database } from "@/database-types";

type ${toPascalCase(name)}Args =
  Database["public"]["Functions"]["${name}"]["Args"];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

${paramExtractions}

${hasRequiredParams ? validationChecks + "\n\n" : ""}${paramsDeclaration}

${optionalParamsBuilding}

  const supabase = await createClient();

  const { data, error } = await supabase.rpc("${name}", params);

  if (error) {
    console.error("Error calling ${name}:", error);
    return NextResponse.json(
      { error: "Failed to execute ${name}" },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}
`;
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
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  let functionName = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--function" || args[i] === "-f") {
      functionName = args[i + 1];
      break;
    }
  }

  return { functionName };
}

/**
 * Find function by name
 */
function findFunction(functions, functionName) {
  if (!functionName) {
    console.error("❌ Error: Function name is required");
    console.log("\nUsage: npm run gen:route -- --function <function_name>");
    console.log("   or: npm run gen:route -- -f <function_name>");
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
    // Try partial match
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
 * Create the API route directory and file
 */
function createRouteFile(functionName, content) {
  const routeDir = path.join(APP_API_DIR, functionName);
  const routeFile = path.join(routeDir, "route.ts");

  // Check if file exists
  if (fs.existsSync(routeFile)) {
    console.log(`\n⚠️  File already exists: ${routeFile}`);
    console.log("Overwriting...");
  }

  // Create directory and file
  fs.mkdirSync(routeDir, { recursive: true });
  fs.writeFileSync(routeFile, content);

  return routeFile;
}

/**
 * Main execution
 */
async function main() {
  console.log("🚀 API Route Generator\n");

  // Parse command line args
  const { functionName } = parseArgs();

  // Read database-types.ts
  console.log("📖 Reading database-types.ts...");
  const typesContent = fs.readFileSync(DATABASE_TYPES_PATH, "utf8");

  // Parse functions
  console.log("🔍 Parsing function definitions...");
  const functions = parseFunctionDefinitions(typesContent);
  console.log(`✅ Found ${functions.length} functions`);

  // Find the specified function
  const selectedFunction = findFunction(functions, functionName);
  console.log(`\n✨ Selected: ${selectedFunction.name}`);

  // Display function details
  console.log("\n📋 Function Details:");
  console.log(`  Name: ${selectedFunction.name}`);
  console.log(`  Arguments:`);
  selectedFunction.args.forEach((arg) => {
    const optional = arg.optional ? "(optional)" : "(required)";
    console.log(`    - ${arg.name}: ${arg.type} ${optional}`);
  });
  console.log(`  Returns: ${selectedFunction.returnsType}`);

  // Generate route content
  console.log("\n⚙️  Generating route file...");
  const routeContent = generateRouteContent(selectedFunction);

  // Create file
  const routeFile = await createRouteFile(selectedFunction.name, routeContent);

  console.log(`\n✅ Route created successfully!`);
  console.log(`📁 Location: ${routeFile}`);
  console.log(`\n🌐 API endpoint will be available at:`);
  console.log(`   /api/${selectedFunction.name}`);

  // Show example usage
  if (selectedFunction.args.length > 0) {
    const exampleParams = selectedFunction.args
      .filter((arg) => !arg.optional)
      .map((arg) => {
        const paramName = arg.name.replace(/^p_/, "");
        const type = getTypeValidator(arg.type);
        let exampleValue = "value";
        if (type === "number") exampleValue = "123";
        if (type === "number[]") exampleValue = "1,2,3";
        if (type === "string[]") exampleValue = "item1,item2";
        if (type === "boolean[]") exampleValue = "true,false";
        if (type.includes("[]") && exampleValue === "value")
          exampleValue = "item1,item2";
        if (type === "boolean") exampleValue = "true";
        return `${paramName}=${exampleValue}`;
      })
      .join("&");

    console.log(`\n📝 Example usage:`);
    console.log(`   /api/${selectedFunction.name}?${exampleParams}`);
  }
}

// Run the script
main().catch((error) => {
  console.error("❌ Error:", error.message);
  process.exit(1);
});
