import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useGeoJsonFileUpload from "@/hooks/geojson-file-upload-hook";
import { rewriteProperties } from "@/utils/property-rewriter";
import { FeatureCollection } from "geojson";
import { useState } from "react";

export function PropertyEditorPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [shouldShowErrorMessage, setShouldShowErrorMessage] =
    useState<boolean>(false);
  const [featureCollection, setFeatureCollection] =
    useState<FeatureCollection | null>(null);
  const [filterProperty, setFilterProperty] = useState<string | null>(null);
  const [targetPropertyName, setTargetPropertyName] = useState<string | null>(
    null
  );
  const [outputFeatureCollection, setOutputFeatureCollection] =
    useState<FeatureCollection | null>(null);

  const setAndShowErrorMessage = (message: string) => {
    setErrorMessage(message);
    setShouldShowErrorMessage(true);
  };

  const hideErrorMessage = () => {
    setErrorMessage(null);
    setShouldShowErrorMessage(false);
  };

  const { handleGeoJsonFileChange } = useGeoJsonFileUpload({
    showErrorMessage: setAndShowErrorMessage,
    setFeatureCollection,
  });

  const getProperties = () => {
    if (!featureCollection) {
      alert("No feature collection");
      return [];
    }

    const features = featureCollection.features;
    if (!features || features.length === 0) {
      alert("No features");
      return [];
    }

    const properties = new Set<string>();
    features.forEach((feature) => {
      const featureProperties = Object.keys(feature.properties || {});
      featureProperties.forEach((property) => {
        properties.add(property);
      });
    });

    return Array.from(properties);
  };

  const execute = () => {
    if (!featureCollection) {
      setAndShowErrorMessage("Please select a GeoJSON file.");
      return;
    }

    if (!filterProperty) {
      setAndShowErrorMessage("Please select a filter property.");
      return;
    }

    if (!targetPropertyName) {
      setAndShowErrorMessage("Please select a target property.");
      return;
    }

    const output = rewriteProperties({
      targetInputPropertyName: filterProperty,
      targetOutputPropertyName: targetPropertyName,
      inputFeatureCollection: featureCollection,
    });

    setOutputFeatureCollection(output);
  };

  return (
    <>
      <AlertDialog open={shouldShowErrorMessage}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={hideErrorMessage}>Close</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/*  */}
      <Card>
        <CardHeader>
          <CardTitle>Property Rewriter</CardTitle>
          <CardDescription>
            Rewrite properties of GeoJSON features.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="geojson">GeoJSON file</Label>
            <Input
              id="geojson"
              type="file"
              accept=".geojson"
              onChange={handleGeoJsonFileChange}
            />
          </div>
          {featureCollection && (
            <>
              <div className="space-y-1">
                <SelectFilterProperty
                  setFilterProperty={setFilterProperty}
                  properties={getProperties()}
                />
              </div>
              <div className="space-y-1">
                <SetTargetPropertyName
                  setTargetPropertyName={setTargetPropertyName}
                />
              </div>
              {outputFeatureCollection && (
                <div className="space-y-1">
                  <Label htmlFor="message">Output</Label>
                  <Textarea
                    id="message"
                    value={JSON.stringify(outputFeatureCollection, null, 2)}
                    readOnly
                    disabled
                  />
                  <Button
                    onClick={() => {
                      const blob = new Blob(
                        [JSON.stringify(outputFeatureCollection, null, 2)],
                        { type: "application/json" }
                      );
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "output.geojson";
                      a.click();
                    }}
                    variant={"outline"}
                  >
                    Download GeoJSON
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={() => execute()} disabled={!featureCollection}>
            Execute
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

type SelectFilterPropertyProps = {
  properties: string[];
  setFilterProperty: (property: string) => void;
};

function SelectFilterProperty({
  properties,
  setFilterProperty,
}: SelectFilterPropertyProps) {
  return (
    <div className="space-y-1">
      <Label htmlFor="filterProperty">Filter property</Label>
      <Select
        onValueChange={(value) => {
          if (typeof value === "string") {
            setFilterProperty(value);
          }
        }}
      >
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="Select a property" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Please select a property</SelectLabel>
            {properties.map((property) => (
              <SelectItem key={property} value={property}>
                {property}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

type SetTargetPropertyNameProps = {
  setTargetPropertyName: (property: string) => void;
};

function SetTargetPropertyName({
  setTargetPropertyName,
}: SetTargetPropertyNameProps) {
  return (
    <div className="space-y-1">
      <Label htmlFor="targetPropertyName">Target property name</Label>
      <Input
        id="targetPropertyName"
        onChange={(event) => setTargetPropertyName(event.target.value)}
      />
    </div>
  );
}
