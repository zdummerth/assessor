import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CopyToClipboard from "@/components/copy-to-clipboard";
import VehicleValuesPagination from "./vehicle-values-pagination";

interface VehicleValuesTableProps {
  make: string;
  model: string;
  trim: string;
  modelYear?: number;
  guideYear?: number;
  currentPage: number;
  itemsPerPage: number;
}

interface VehicleValueResult {
  vehicle_id: string;
  type: string | null;
  make: string;
  model: string;
  trim: string | null;
  description: string;
  guide_year: number;
  year: number;
  value: number;
  vehicle_created_at: string;
  vehicle_updated_at: string;
}

export default async function VehicleValuesTable({
  make,
  model,
  trim,
  modelYear,
  guideYear,
  currentPage,
  itemsPerPage,
}: VehicleValuesTableProps) {
  const supabase = await createClient();

  // Calculate pagination range
  const rangeStart = (currentPage - 1) * itemsPerPage;
  const rangeEnd = rangeStart + itemsPerPage - 1;

  // Build the RPC parameters
  const params: {
    p_make?: string;
    p_model?: string;
    p_trim?: string;
    p_model_year_min?: number;
    p_model_year_max?: number;
    p_guide_year?: number;
  } = {};

  if (make) params.p_make = make;
  if (model) params.p_model = model;
  if (trim) params.p_trim = trim;
  if (modelYear) {
    params.p_model_year_min = modelYear;
    params.p_model_year_max = modelYear;
  }
  if (guideYear) params.p_guide_year = guideYear;

  // Query with pagination using .range()
  const { data, error, count } = await supabase
    .rpc("search_vehicle_values", params, {
      count: "exact",
    })
    .range(rangeStart, rangeEnd);

  if (error) {
    console.error("Error fetching vehicle values:", error);
    return (
      <Card className="p-6">
        <p className="text-red-600">
          Error loading vehicle values: {error.message}
        </p>
      </Card>
    );
  }

  const results = (data as VehicleValueResult[]) || [];

  // Group results by vehicle for better display
  const groupedResults = results.reduce(
    (acc, result) => {
      if (!acc[result.vehicle_id]) {
        acc[result.vehicle_id] = {
          vehicle_id: result.vehicle_id,
          type: result.type,
          make: result.make,
          model: result.model,
          trim: result.trim,
          description: result.description,
          values: [],
        };
      }
      acc[result.vehicle_id].values.push({
        guide_year: result.guide_year,
        year: result.year,
        value: result.value,
      });
      return acc;
    },
    {} as Record<
      string,
      {
        vehicle_id: string;
        type: string | null;
        make: string;
        model: string;
        trim: string | null;
        description: string;
        values: Array<{
          guide_year: number;
          year: number;
          value: number;
        }>;
      }
    >
  );

  const vehicles = Object.values(groupedResults);
  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  if (vehicles.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground">
          {make || model || trim || modelYear || guideYear
            ? "No vehicle values found matching your search criteria."
            : "Enter search criteria above to find vehicle values."}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center text-sm text-muted-foreground">
        <Badge variant="secondary">
          {totalCount} vehicle{totalCount !== 1 ? "s" : ""}
        </Badge>
        <span>
          Showing {rangeStart + 1}-
          {Math.min(rangeEnd + 1, rangeStart + vehicles.length)}
        </span>
      </div>

      {vehicles.map((vehicle) => (
        <Card key={vehicle.vehicle_id} className="p-4">
          <div className="space-y-3">
            {/* Vehicle Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg">
                    {vehicle.make} {vehicle.model}
                    {vehicle.trim && ` ${vehicle.trim}`}
                  </h3>
                  <CopyToClipboard
                    text={`${vehicle.make} ${vehicle.model} ${vehicle.trim ?? ""}`}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    {vehicle.description}
                  </p>
                  <CopyToClipboard text={vehicle.description} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Vehicle ID: {vehicle.vehicle_id}
                </p>
              </div>
              <div>
                {vehicle.type && (
                  <Badge variant="outline">{vehicle.type}</Badge>
                )}
              </div>
            </div>

            {/* Values Grid */}
            <div className="border-t pt-3">
              <h4 className="text-sm font-semibold mb-2">Values:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {vehicle.values
                  .sort((a, b) => {
                    // Sort by guide year DESC, then year DESC
                    if (a.guide_year !== b.guide_year) {
                      return b.guide_year - a.guide_year;
                    }
                    return b.year - a.year;
                  })
                  .map((val, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 p-3 rounded border border-slate-200"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            {val.guide_year} Guide
                          </p>
                          <p className="text-sm font-medium">
                            {val.year === 9999 ? "Default" : val.year} Model
                          </p>
                        </div>
                        <p className="text-lg font-semibold text-green-700">
                          ${val.value.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </Card>
      ))}

      {totalPages > 1 && (
        <VehicleValuesPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  );
}
