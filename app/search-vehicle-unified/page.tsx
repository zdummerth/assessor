import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";
import { ParametersForm } from "./parameters-form";

export default function SearchVehicleUnifiedPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Unified Vehicle Search</CardTitle>
            <CardDescription>
              Search by VIN or vehicle description to find matching vehicles
              with guide values
            </CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <InfoIcon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>How Unified Vehicle Search Works</DialogTitle>
              </DialogHeader>
              <DialogDescription asChild>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Search Methods
                    </h4>
                    <p className="mb-2">
                      This tool provides three ways to search for vehicles:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>
                        <strong>Auto-detect:</strong> Automatically determines
                        whether you're searching by VIN (8-17 alphanumeric
                        characters) or description
                      </li>
                      <li>
                        <strong>VIN Search:</strong> Search using a complete or
                        partial Vehicle Identification Number
                      </li>
                      <li>
                        <strong>Description Search:</strong> Search using make,
                        model, or other descriptive text
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      VIN Search Process
                    </h4>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      <li>
                        First checks the local VIN lookup table for matches
                        (supports wildcards with '?')
                      </li>
                      <li>
                        For each VIN match, finds similar vehicles in the guide
                        database with values
                      </li>
                      <li>
                        If no local matches and full 17-character VIN provided,
                        falls back to NHTSA API
                      </li>
                      <li>
                        Returns guide vehicle matches with their values across
                        multiple years
                      </li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Description Search Process
                    </h4>
                    <p>
                      Searches the guide vehicle database using text similarity
                      matching on make, model, trim, and description fields.
                      Returns matching vehicles with their associated values for
                      different guide years and model years.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Advanced Options
                    </h4>
                    <dl className="space-y-2">
                      <div>
                        <dt className="font-medium">Guide Year</dt>
                        <dd className="text-muted-foreground ml-2">
                          Filter results to a specific guide year (default:
                          2026)
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium">Match Limit</dt>
                        <dd className="text-muted-foreground ml-2">
                          Maximum number of guide vehicle matches to return per
                          result (default: 10)
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium">Similarity Threshold</dt>
                        <dd className="text-muted-foreground ml-2">
                          Minimum similarity score (0-1) for matches (default:
                          0.4)
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium">Year Tolerance</dt>
                        <dd className="text-muted-foreground ml-2">
                          Year range tolerance for NHTSA API matching (default:
                          1)
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Data Sources
                    </h4>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>
                        <strong>VIN Lookup Table:</strong> Local database of
                        VINs with vehicle information
                      </li>
                      <li>
                        <strong>NHTSA API:</strong> National Highway Traffic
                        Safety Administration API for VIN decoding
                      </li>
                      <li>
                        <strong>Guide Database:</strong> Comprehensive vehicle
                        guide with multi-year values
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Understanding Results
                    </h4>
                    <p>
                      Results include the matched vehicles with their similarity
                      scores, types, and associated values. Guide values are
                      organized by guide year and model year, making it easy to
                      find the appropriate valuation for any vehicle.
                    </p>
                  </div>
                </div>
              </DialogDescription>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <ParametersForm />
      </CardContent>
    </Card>
  );
}
