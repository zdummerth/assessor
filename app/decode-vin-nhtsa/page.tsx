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

export default function DecodeVinNhtsaPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Decode VIN via NHTSA API</CardTitle>
            <CardDescription>
              Enter a VIN to decode using NHTSA's database and find matching
              vehicles in our guide database with weighted scoring
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
                <DialogTitle>How NHTSA VIN Decoding Works</DialogTitle>
              </DialogHeader>
              <DialogDescription asChild>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      VIN Decoding Process
                    </h4>
                    <p>
                      When you enter a VIN, the system calls the NHTSA (National
                      Highway Traffic Safety Administration) API to decode the
                      VIN and retrieve vehicle information including make,
                      model, year, trim, displacement, body class, drive type,
                      and more.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Guide Matching Algorithm
                    </h4>
                    <p className="mb-2">
                      The decoded information is then matched against our guide
                      vehicle database using a sophisticated weighted scoring
                      system:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>
                        <strong>Make Similarity:</strong> 25% weight - checks
                        how similar the make values are
                      </li>
                      <li>
                        <strong>Model Similarity:</strong> 35% weight - compares
                        model names after removing dashes
                      </li>
                      <li>
                        <strong>Trim Similarity:</strong> 40% weight - matches
                        trim against a search string built from trim,
                        displacement, body class, and drive type
                      </li>
                      <li>
                        <strong>Bonus Scores:</strong> +5% each for matching
                        body class and drive type in description
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Two-Pass Matching Strategy
                    </h4>
                    <p>The system uses a two-pass approach to find matches:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                      <li>
                        <strong>Strict Pass:</strong> Make contains match, high
                        model similarity (&gt; 0.6), and trim similarity (&gt;
                        0.3)
                      </li>
                      <li>
                        <strong>Relaxed Pass:</strong> Good overall make and
                        model similarity (&gt; 0.5 each)
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Confidence Levels
                    </h4>
                    <p>Each match is assigned a confidence level:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                      <li>
                        <strong>High:</strong> Final score ≥ 0.8 - Very likely
                        the correct match
                      </li>
                      <li>
                        <strong>Medium:</strong> Final score ≥ 0.6 - Probable
                        match
                      </li>
                      <li>
                        <strong>Low:</strong> Final score &lt; 0.6 - Possible
                        match but requires verification
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Year Tolerance
                    </h4>
                    <p>
                      The system only returns guide values within the specified
                      year tolerance of the vehicle's model year (default ±1
                      year). This ensures the values shown are relevant for the
                      specific year of the vehicle.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Adjustable Parameters
                    </h4>
                    <p>
                      Use the advanced options to fine-tune the matching
                      algorithm:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                      <li>
                        <strong>Year Tolerance:</strong> How many years +/- to
                        include in value results
                      </li>
                      <li>
                        <strong>Match Threshold:</strong> Minimum composite
                        score required for a match
                      </li>
                      <li>
                        <strong>Make/Model/Trim Thresholds:</strong> Individual
                        similarity thresholds for each field
                      </li>
                      <li>
                        <strong>Result Limit:</strong> Maximum number of matches
                        to return
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Value Prioritization
                    </h4>
                    <p>
                      Matches with available guide values for the model year are
                      prioritized higher in the results. The value count badge
                      shows how many values are available for that vehicle.
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
