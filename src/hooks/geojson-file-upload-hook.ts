import { FeatureCollection } from "geojson";
import { useState } from "react";

type GeoJsonFileUploadHook = {
  showErrorMessage: (message: string) => void;
  setFeatureCollection: (
    setState: (prevState: FeatureCollection | null) => FeatureCollection | null
  ) => void;
};

type GeoJsonFileUploadReturn = {
  handleGeoJsonFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const useGeoJsonFileUpload = (
  props: GeoJsonFileUploadHook
): GeoJsonFileUploadReturn => {
  const { showErrorMessage, setFeatureCollection } = props;

  const [, setGeoJsonFile] = useState<File | null>(null);

  //   const handleGeoJsonFileChange = (
  const handleGeoJsonFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setGeoJsonFile(files[0]);
    } else {
      showErrorMessage("Please select a (one) GeoJSON file.");
    }

    // read the file
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === "string") {
        if (result.length === 0) {
          showErrorMessage("The GeoJSON file is empty.");
          return;
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        setFeatureCollection((_prev) => JSON.parse(result));
      } else {
        showErrorMessage("Failed to read the GeoJSON file.");
      }
    };

    if (files && files.length > 0) {
      reader.readAsText(files[0]);
    } else {
      showErrorMessage("Please select a (one) GeoJSON file.");
    }
  };

  return {
    handleGeoJsonFileChange,
  };
};

export default useGeoJsonFileUpload;
