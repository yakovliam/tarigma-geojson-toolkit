import { FeatureCollection, Feature, LineString } from "geojson";

export type SegmentCombinerParameters = {
  targetPropertyName: string;
  targetPropertyValue: string;
  inputFeatureCollection: FeatureCollection;
};

export function combineSegments({
  targetPropertyName,
  targetPropertyValue,
  inputFeatureCollection,
}: SegmentCombinerParameters): FeatureCollection {
  const features = inputFeatureCollection.features;

  const targetFeatures = features.filter(
    (feature: Feature) =>
      feature.properties?.[targetPropertyName].toString() ===
      targetPropertyValue
  );

  const targetFeature: Feature = {
    type: "Feature",
    geometry: {
      type: "MultiLineString",
      coordinates: targetFeatures.map(
        (feature: Feature) => (feature.geometry as LineString).coordinates
      ),
    },
    properties: {
      [targetPropertyName]: targetPropertyValue,
    },
  };

  return {
    type: "FeatureCollection",
    features: [targetFeature],
  };
}
