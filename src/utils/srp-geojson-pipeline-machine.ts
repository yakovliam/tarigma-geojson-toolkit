import { UploadedFile } from "@/types/upload-types";

export type SRPGeoJsonPipelineMachineContext = {
  /**
   * The input files for the pipeline.
   */
  inputFiles: UploadedFile[];

  /**
   * The output file path for the pipeline.
   */
  outputFilePath: string;

  /**
   * The key of the property to filter.
   */
  filterPropertyKey: string;

  /**
   * The key of the property to transform.
   */
  transformedPropertyKey: string;
};
