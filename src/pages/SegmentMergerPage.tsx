import {
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FeatureCollection } from "geojson";
import { combineSegments } from "@/utils/segment-cominer";
import { Textarea } from "@/components/ui/textarea";
import useGeoJsonFileUpload from "@/hooks/geojson-file-upload-hook";

export function SegmentMergerPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [shouldShowErrorMessage, setShouldShowErrorMessage] =
    useState<boolean>(false);
  const [featureCollection, setFeatureCollection] =
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

  const [filterProperty, setFilterProperty] = useState<string | null>(null);
  const [filterPropertyValue, setFilterPropertyValue] = useState<string | null>(
    null,
  );

  const [outputFeatureCollection, setOutputFeatureCollection] =
    useState<FeatureCollection | null>(null);

  const getProperties = () => {
    if (!featureCollection) {
      return [];
    }

    const features = featureCollection.features;
    if (!features || features.length === 0) {
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

  const getPropertyValues = (property: string) => {
    if (!featureCollection) {
      return [];
    }

    const features = featureCollection.features;
    if (!features || features.length === 0) {
      return [];
    }

    const values = new Set<string>();
    features.forEach((feature) => {
      const value = feature.properties?.[property];
      if (value) {
        values.add(value.toString());
      }
    });

    return Array.from(values);
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

    if (!filterPropertyValue) {
      setAndShowErrorMessage("Please select a filter property value.");
      return;
    }

    const outputFeatureCollection = combineSegments({
      targetPropertyName: filterProperty,
      targetPropertyValue: filterPropertyValue,
      inputFeatureCollection: featureCollection,
    });

    setOutputFeatureCollection(outputFeatureCollection);
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
          <CardTitle>Segment Merger</CardTitle>
          <CardDescription>
            Merge multiple segments into one MultiLineString.
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
              {filterProperty && (
                <div className="space-y-1">
                  <SelectFilterPropertyValue
                    setFilterPropertyValue={setFilterPropertyValue}
                    values={getPropertyValues(filterProperty)}
                  />
                </div>
              )}
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
                        { type: "application/json" },
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
            Transform Segments
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

type SelectFilterPropertyValueProps = {
  values: string[];
  setFilterPropertyValue: (value: string) => void;
};

function SelectFilterPropertyValue({
  values,
  setFilterPropertyValue,
}: SelectFilterPropertyValueProps) {
  return (
    <div className="space-y-1">
      <Label htmlFor="filterPropertyValue">Filter property value</Label>
      <Select
        onValueChange={(value) => {
          setFilterPropertyValue(value.toString());
        }}
      >
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="Select a property value" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Please select a property value</SelectLabel>
            {values.map((value) => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
