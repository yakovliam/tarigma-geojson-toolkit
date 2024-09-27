import { UploadedFile } from "@/types/upload-types";
import { SRPGeoJsonPipelineMachineContext } from "@/utils/srp-geojson-pipeline-machine";
import { useState } from "react";

type UseSRPGEOJSONPipelineStateResponse = {
  updateFiles: (files: UploadedFile[]) => void;
  updateFilterPropertyKey: (key: string) => void;
  updateTransformedPropertyKey: (key: string) => void;
  state: SRPGeoJsonPipelineMachineContext | null;
};

export const useSRPGEOJSONPipelineState =
  (): UseSRPGEOJSONPipelineStateResponse => {
    const [state, setState] = useState<SRPGeoJsonPipelineMachineContext | null>(
      null,
    );

    const updateFiles = (files: UploadedFile[]) => {
      setState((prev) => ({
        ...prev!,
        inputFiles: files,
      }));
    };

    const updateFilterPropertyKey = (key: string) => {
      setState((prev) => ({
        ...prev!,
        filterPropertyKey: key,
      }));
    };

    const updateTransformedPropertyKey = (key: string) => {
      setState((prev) => ({
        ...prev!,
        transformedPropertyKey: key,
      }));
    };

    return {
      updateFiles,
      updateFilterPropertyKey,
      updateTransformedPropertyKey,
      state,
    };
  };
