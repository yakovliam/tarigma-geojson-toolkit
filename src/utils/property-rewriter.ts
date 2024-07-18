import { FeatureCollection, Feature } from "geojson";

export type SegmentCombinerParameters = {
  targetInputPropertyName: string;
  targetOutputPropertyName: string;
  inputFeatureCollection: FeatureCollection;
};

export function rewriteProperties({
  targetInputPropertyName,
  targetOutputPropertyName,
  inputFeatureCollection,
}: SegmentCombinerParameters): FeatureCollection {
  const features = inputFeatureCollection.features;

  const targetFeatures = features.filter(
    (feature: Feature) =>
      feature.properties?.[targetInputPropertyName] !== undefined,
  );

  // just rename targetInputPropertyName to targetOutputPropertyName
  const outputFeatures = [...targetFeatures].map((feature: Feature) => {
    const properties = { ...feature.properties };
    properties[targetOutputPropertyName] = properties[targetInputPropertyName];
    delete properties[targetInputPropertyName];
    return {
      ...feature,
      properties,
    };
  });

  return {
    type: "FeatureCollection",
    features: outputFeatures,
  };
}
