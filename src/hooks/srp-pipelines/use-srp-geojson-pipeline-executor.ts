import { SRPGeoJsonPipelineMachineContext } from "@/utils/srp-geojson-pipeline-machine";
import { useGeoJSONFeatureParser } from "../use-geojson-feature-parser";
import {
  Feature,
  FeatureCollection,
  LineString,
  MultiLineString,
} from "geojson";

type UseSRPGeoJSONPipelineExecutorProps = {
  context: SRPGeoJsonPipelineMachineContext | null;
  handleError: (error: Error) => void;
};

type UseSRPGeoJSONPipelineExecutorResponse = {
  execute: () => FeatureCollection[] | undefined;
};

export const useSRPGeoJSONPipelineExecutor = (
  props: UseSRPGeoJSONPipelineExecutorProps,
): UseSRPGeoJSONPipelineExecutorResponse => {
  const { context, handleError } = props;
  const { featureCollection } = useGeoJSONFeatureParser({
    uploadedFiles: context?.inputFiles,
  });

  const execute = (): FeatureCollection[] | undefined => {
    const filterPropertyKey = context?.filterPropertyKey;
    const transformedPropertyKey = context?.transformedPropertyKey;

    if (!filterPropertyKey || !transformedPropertyKey) {
      handleError(new Error("Filter or transformed property key not found"));
      return;
    }

    // logic:
    // Loop through the feature collection, and collect
    // all lineStrings from the features into 1 multiLineString
    // per matching filterPropertyKey

    // then, transform the property from filterPropertyKey to transformedPropertyKey
    // then return each feature collection separately so we can save
    // them as separate files

    if (!featureCollection) {
      handleError(new Error("No feature collection found"));
      return;
    }

    // get an array of all the unique filterPropertyKey values
    const filterPropertyValues = featureCollection.features.map(
      (feature) => feature.properties?.[filterPropertyKey],
    );

    // loop through the unique filterPropertyKey values
    // and collect all linestrings that match the filterPropertyKey value
    const transformedFeatures = filterPropertyValues.map((value) => {
      const matchingFeatures = featureCollection.features.filter(
        (feature) => feature.properties?.[filterPropertyKey] === value,
      );

      const transformedFeatures: Feature<MultiLineString>[] = [];
      const multiLineString: MultiLineString = {
        type: "MultiLineString",
        coordinates: [],
      };

      matchingFeatures.map((feature) => {
        const lineString = feature.geometry as LineString;
        multiLineString.coordinates.push(lineString.coordinates);
      });

      const transformedFeature: Feature<MultiLineString> = {
        type: "Feature",
        geometry: multiLineString,
        properties: {
          [transformedPropertyKey]: value,
        },
      };

      transformedFeatures.push(transformedFeature);

      return transformedFeatures;
    });

    // create a feature collection for each transformed feature
    const transformedFeatureCollections: FeatureCollection[] =
      transformedFeatures.map((features) => {
        return {
          type: "FeatureCollection",
          features,
        };
      });

    return transformedFeatureCollections;
  };

  return { execute };
};
