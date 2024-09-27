import { UploadedFile } from "@/types/upload-types";
import { FeatureCollection } from "geojson";
import { useEffect, useState } from "react";

type UseGeoJsonFeatureParserProps = {
  uploadedFiles?: UploadedFile[] | undefined;
};

export const useGeoJSONFeatureParser = (
  props: UseGeoJsonFeatureParserProps,
) => {
  const [featureCollection, setFeatureCollection] =
    useState<FeatureCollection | null>(null);

  useEffect(() => {
    if (!props.uploadedFiles || props.uploadedFiles.length <= 0) {
      return;
    }

    const files = props.uploadedFiles;

    const featureCollections = files.map((file) => {
      try {
        return JSON.parse(file.data as string);
      } catch (error) {
        console.error("Failed to parse GeoJSON file", file, error);
        return null;
      }
    });

    // flatten the feature collection to a single array of features
    const features = featureCollections.reduce((acc, featureCollection) => {
      if (!featureCollection) {
        return acc;
      }

      if (featureCollection.type === "Feature") {
        return acc.concat(featureCollection);
      }

      if (featureCollection.type === "FeatureCollection") {
        return acc.concat(featureCollection.features);
      }

      return acc;
    }, []);

    const featureCollection: FeatureCollection = {
      type: "FeatureCollection",
      features: features,
    };

    setFeatureCollection(featureCollection);
  }, [props.uploadedFiles]);

  return { featureCollection };
};
