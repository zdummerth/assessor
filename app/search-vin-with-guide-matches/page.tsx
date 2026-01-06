import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ParametersForm } from "./parameters-form";

export default function SearchVinWithGuideMatchesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Search VINs</CardTitle>
        <CardDescription>
          Enter a VIN to search for matches and find similar descriptions in the
          guide database
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ParametersForm />
      </CardContent>
    </Card>
  );
}
