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

export default function SearchVinWithGuideMatchesPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Search VINs</CardTitle>
            <CardDescription>
              Enter a VIN to search for matches and find similar descriptions in
              the guide database
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
                <DialogTitle>How VIN to Guide Matching Works</DialogTitle>
              </DialogHeader>
              <DialogDescription asChild>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      VIN Lookup Process
                    </h4>
                    <p>
                      When you enter a VIN, the system first looks up the VIN in
                      our database to get its description, model year, and type.
                      It then searches for similar vehicles in the guide
                      database using trigram similarity matching.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Why Descriptions May Differ
                    </h4>
                    <p className="mb-2">
                      VIN descriptions often differ from guide value
                      descriptions due to:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>
                        <strong>Naming variations:</strong> Manufacturers may
                        use different terminology than value guides
                      </li>
                      <li>
                        <strong>Trim level detail:</strong> VINs may have more
                        specific or generic trim information
                      </li>
                      <li>
                        <strong>Package options:</strong> Special packages may
                        not be separately valued in guides
                      </li>
                      <li>
                        <strong>Regional differences:</strong> Model names can
                        vary by market
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Model Year Matching
                    </h4>
                    <p>
                      Values that match the VIN's model year are{" "}
                      <strong className="text-blue-600">
                        highlighted in blue with a star (★)
                      </strong>
                      . This helps you quickly identify the most relevant
                      pricing for that specific vehicle year.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Similarity Scores
                    </h4>
                    <p className="mb-2">
                      The similarity score indicates how closely the guide
                      vehicle matches the VIN description:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>
                        <span className="font-medium text-green-700">100%</span>{" "}
                        - Exact description match
                      </li>
                      <li>
                        <span className="font-medium text-blue-700">
                          80-99%
                        </span>{" "}
                        - Very likely the same vehicle
                      </li>
                      <li>
                        <span className="font-medium text-yellow-700">
                          60-79%
                        </span>{" "}
                        - Similar vehicle, verify details
                      </li>
                      <li>
                        <span className="font-medium text-orange-700">
                          40-59%
                        </span>{" "}
                        - Partial match, check carefully
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Using the Results
                    </h4>
                    <p>
                      Review multiple matches when available. A lower similarity
                      score doesn't always mean incorrect - it may reflect
                      legitimate naming differences. Always verify the make,
                      model, and key features match before using a value.
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
