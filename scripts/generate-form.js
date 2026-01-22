#!/usr/bin/env node

/**
 * Generate CRUD Form Components from Database Function Types
 *
 * Creates form components for create/update operations:
 * - form.tsx (client component with useActionState)
 * - actions.ts (server actions)
 * - Toast notifications for success/error
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
 * Get label from parameter name
 */
function getLabel(name) {
  return name
    .replace(/^p_/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

/**
 * Extract entity name from parameter name for id/ids fields
 * Example: p_assigned_by_employee_id -> employee
 * Example: p_value_ids -> value
 */
function getEntityFromParamName(name) {
  const cleanName = name.replace(/^p_/, "");

  // Check for _ids (plural)
  if (cleanName.endsWith("_ids")) {
    const parts = cleanName.replace(/_ids$/, "").split("_");
    return parts[parts.length - 1];
  }

  // Check for _id (singular)
  if (cleanName.endsWith("_id")) {
    const parts = cleanName.replace(/_id$/, "").split("_");
    return parts[parts.length - 1];
  }

  return null;
}

/**
 * Check if parameter is an id field
 */
function isIdField(name, type) {
  const cleanName = name.replace(/^p_/, "");
  const isNumberType = type === "number" || type === "number[]";
  return (
    isNumberType && (cleanName.endsWith("_id") || cleanName.endsWith("_ids"))
  );
}

/**
 * Get input type for form field
 */
function getInputType(name, type) {
  if (isIdField(name, type)) {
    return type.includes("[]") ? "multi-combobox" : "combobox";
  }
  if (type === "number" || type === "number[]") return "number";
  if (type === "boolean") return "checkbox";
  if (type.includes("[]")) return "text"; // Arrays as comma-separated
  return "text";
}

/**
 * Get TypeScript type for form value
 */
function getTsType(type) {
  if (type === "number" || type === "number[]") return "number";
  if (type === "boolean") return "boolean";
  return "string";
}

/**
 * Generate form field component
 */
function generateFormField(arg) {
  const paramName = toParamName(arg.name);
  const label = getLabel(arg.name);
  const inputType = getInputType(arg.name, arg.type);
  const required = !arg.optional;

  if (inputType === "checkbox") {
    return `        <div className="flex items-center space-x-2">
          <Checkbox
            id="${arg.name}"
            name="${arg.name}"
            aria-label="${label}"
          />
          <Label htmlFor="${arg.name}" className="text-sm font-medium cursor-pointer">
            ${label}
          </Label>
        </div>`;
  }

  if (inputType === "combobox") {
    const entity = getEntityFromParamName(arg.name);
    const endpoint = `/api/${entity}`;
    return `        <Combobox
          name="${arg.name}"
          label="${label}"
          endpoint="${endpoint}"
          ${required ? "required" : ""}
        />`;
  }

  if (inputType === "multi-combobox") {
    const entity = getEntityFromParamName(arg.name);
    const endpoint = `/api/${entity}`;
    return `        <MultiCombobox
          name="${arg.name}"
          label="${label}"
          endpoint="${endpoint}"
          ${required ? "required" : ""}
        />`;
  }

  if (arg.type.includes("[]") && inputType === "text") {
    return `        <div className="space-y-2">
          <Label htmlFor="${arg.name}" className="text-sm font-medium">
            ${label}${required ? " *" : ""}
          </Label>
          <Input
            id="${arg.name}"
            name="${arg.name}"
            type="text"
            placeholder="Comma-separated values"
            ${required ? 'required aria-required="true"' : ""}
          />
          <p className="text-xs text-muted-foreground">
            Enter multiple values separated by commas
          </p>
        </div>`;
  }

  return `        <div className="space-y-2">
          <Label htmlFor="${arg.name}" className="text-sm font-medium">
            ${label}${required ? " *" : ""}
          </Label>
          <Input
            id="${arg.name}"
            name="${arg.name}"
            type="${inputType}"
            placeholder="${label}"
            ${required ? 'required aria-required="true"' : ""}
          />
        </div>`;
}

/**
 * Generate form component
 */
function generateFormContent(functionName, args) {
  const pascalName = toPascalCase(functionName);
  const formFields = args.map((arg) => generateFormField(arg)).join("\n\n");

  const hasCombobox = args.some(
    (arg) => getInputType(arg.name, arg.type) === "combobox"
  );
  const hasMultiCombobox = args.some(
    (arg) => getInputType(arg.name, arg.type) === "multi-combobox"
  );

  const imports = [
    `"use client";`,
    ``,
    `import { useActionState } from "react";`,
    `import { useEffect } from "react";`,
    `import { Button } from "@/components/ui/button";`,
    `import { Input } from "@/components/ui/input";`,
    `import { Label } from "@/components/ui/label";`,
    `import { Checkbox } from "@/components/ui/checkbox";`,
    hasCombobox ? `import { Combobox } from "@/components/ui/combobox";` : null,
    hasMultiCombobox
      ? `import { MultiCombobox } from "@/components/ui/multi-combobox";`
      : null,
    `import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";`,
    `import { execute${pascalName} } from "./actions";`,
    `import { toast } from "sonner";`,
  ]
    .filter(Boolean)
    .join("\n");

  return `${imports}

export function ${pascalName}Form() {
  const [state, formAction, isPending] = useActionState(execute${pascalName}, {
    error: "",
    success: "",
  });

  // Show toast notifications
  useEffect(() => {
    if (state.success) {
      toast.success(state.success);
    }
    if (state.error) {
      toast.error(state.error);
    }
  }, [state.success, state.error]);

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
        <CardTitle className="text-2xl">${pascalName.replace(/([A-Z])/g, " $1").trim()}</CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6">
        <form action={formAction} className="space-y-6">
${formFields}

          {/* Error Display */}
          {state.error && (
            <div
              className="text-red-600 text-sm p-3 bg-red-50 rounded-md border border-red-200"
              role="alert"
            >
              {state.error}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isPending}
              className="min-w-[120px]"
            >
              {isPending ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
            
            <Button
              type="reset"
              variant="outline"
              disabled={isPending}
            >
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
`;
}

/**
 * Generate conversion code for FormData to params
 */
function getFormDataConversion(arg) {
  const type = arg.type;

  if (type === "number") {
    return `    const ${arg.name}Value = formData.get("${arg.name}");
    if (${arg.name}Value) {
      params.${arg.name} = Number(${arg.name}Value);
    }`;
  }

  if (type === "number[]") {
    return `    const ${arg.name}Value = formData.get("${arg.name}");
    if (${arg.name}Value) {
      params.${arg.name} = (${arg.name}Value as string).split(',').map(Number);
    }`;
  }

  if (type === "boolean") {
    return `    const ${arg.name}Value = formData.get("${arg.name}");
    if (${arg.name}Value !== null) {
      params.${arg.name} = ${arg.name}Value === "on";
    }`;
  }

  if (type === "boolean[]") {
    return `    const ${arg.name}Value = formData.get("${arg.name}");
    if (${arg.name}Value) {
      params.${arg.name} = (${arg.name}Value as string).split(',').map(v => v === 'true');
    }`;
  }

  if (type === "string[]") {
    return `    const ${arg.name}Value = formData.get("${arg.name}");
    if (${arg.name}Value) {
      params.${arg.name} = (${arg.name}Value as string).split(',').map(s => s.trim());
    }`;
  }

  // Default string
  if (arg.optional) {
    return `    const ${arg.name}Value = formData.get("${arg.name}");
    if (${arg.name}Value) {
      params.${arg.name} = ${arg.name}Value as string;
    }`;
  }

  return `    params.${arg.name} = formData.get("${arg.name}") as string;`;
}

/**
 * Generate validation for required fields
 */
function generateValidation(args) {
  const requiredArgs = args.filter((arg) => !arg.optional);
  if (requiredArgs.length === 0) return "";

  const validations = requiredArgs.map((arg) => {
    const label = getLabel(arg.name);
    return `    if (!params.${arg.name}) {
      return {
        error: "${label} is required",
        success: "",
      };
    }`;
  });

  return "\n    // Validate required fields\n" + validations.join("\n");
}

/**
 * Generate server actions
 */
function generateActionsContent(functionName, args) {
  const pascalName = toPascalCase(functionName);
  const requiredArgs = args.filter((arg) => !arg.optional);
  const optionalArgs = args.filter((arg) => arg.optional);
  const hasRequiredArgs = requiredArgs.length > 0;

  // Generate conversions for required fields (for object initialization)
  const requiredConversions = requiredArgs
    .map((arg) => {
      const type = arg.type;

      if (type === "number") {
        return `      ${arg.name}: Number(formData.get("${arg.name}")),`;
      } else if (type === "number[]") {
        return `      ${arg.name}: (formData.get("${arg.name}") as string).split(',').map(Number),`;
      } else if (type === "boolean") {
        return `      ${arg.name}: formData.get("${arg.name}") === "on",`;
      } else if (type === "boolean[]") {
        return `      ${arg.name}: (formData.get("${arg.name}") as string).split(',').map(v => v === 'true'),`;
      } else if (type === "string[]") {
        return `      ${arg.name}: (formData.get("${arg.name}") as string).split(',').map(s => s.trim()),`;
      } else {
        return `      ${arg.name}: formData.get("${arg.name}") as string,`;
      }
    })
    .join("\n");

  // Generate conversions for optional fields (conditional assignment)
  const optionalConversions = optionalArgs
    .map((arg) => {
      return getFormDataConversion(arg);
    })
    .join("\n\n");

  const validation = generateValidation(args);

  const paramsDeclaration = hasRequiredArgs
    ? `    const params: ${pascalName}Args = {
${requiredConversions}
    };`
    : `    const params: Partial<${pascalName}Args> = {};`;

  return `"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Database } from "@/database-types";

type ${pascalName}Args = Database["public"]["Functions"]["${functionName}"]["Args"];

export async function execute${pascalName}(
  prevState: { error: string; success: string },
  formData: FormData
): Promise<{ error: string; success: string; data?: any }> {
  try {
    const supabase = await createClient();

    // Build params object from FormData
${paramsDeclaration}

${optionalConversions ? optionalConversions : ""}
${validation}

    // Execute database function
    const { data, error } = await supabase.rpc("${functionName}", params);

    if (error) {
      console.error("Database error:", error);
      return {
        error: \`Failed to execute ${functionName}: \${error.message}\`,
        success: "",
      };
    }

    // Revalidate relevant paths
    revalidatePath("/");

    return {
      error: "",
      success: "Operation completed successfully",
      data,
    };
  } catch (error) {
    console.error("Error executing ${functionName}:", error);
    return {
      error: error instanceof Error ? error.message : "An unknown error occurred",
      success: "",
    };
  }
}
`;
}

/**
 * Generate page wrapper
 */
function generatePageContent(functionName) {
  const pascalName = toPascalCase(functionName);

  return `import { ${pascalName}Form } from "./form";

export default function ${pascalName}Page() {
  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <${pascalName}Form />
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
      "\nUsage: npm run gen:form -- --function <function_name> [--path <relative_path>]"
    );
    console.log(
      "   or: npm run gen:form -- -f <function_name> [-p <relative_path>]"
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
 * Create form files
 */
function createFormFiles(functionName, args, componentPath) {
  const targetPath = componentPath || functionName.replace(/_/g, "-");
  const componentDir = path.join(APP_DIR, targetPath);

  // Create directory
  if (!fs.existsSync(componentDir)) {
    fs.mkdirSync(componentDir, { recursive: true });
  }

  const files = [
    { name: "page.tsx", content: generatePageContent(functionName) },
    { name: "form.tsx", content: generateFormContent(functionName, args) },
    { name: "actions.ts", content: generateActionsContent(functionName, args) },
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
  console.log("🚀 Form Generator\n");

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

  console.log("\n⚙️  Generating form files...");
  const { componentDir, createdFiles } = createFormFiles(
    selectedFunction.name,
    selectedFunction.args,
    componentPath
  );

  console.log(`\n✅ Form created successfully!`);
  console.log(`📁 Location: ${componentDir}`);
  console.log(`\n📝 Created files:`);
  createdFiles.forEach((file) => {
    console.log(`   - ${path.basename(file)}`);
  });

  const routePath = componentPath || selectedFunction.name.replace(/_/g, "-");
  console.log(`\n🌐 Form will be available at:`);
  console.log(`   /${routePath}`);

  console.log(`\n📦 Required packages:`);
  console.log(`   - sonner (for toast notifications)`);
  console.log(`   Install with: npm install sonner`);
}

main().catch((error) => {
  console.error("❌ Error:", error.message);
  process.exit(1);
});
