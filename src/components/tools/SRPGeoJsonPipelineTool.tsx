import { StepItem, Stepper, Step, useStepper } from "../stepper";
import { Button } from "../ui/button";
import { FileUploader } from "../file/file-uploader";
import { useLocalUpload } from "@/hooks/use-local-upload";
import { useEffect, useState } from "react";
import { UploadedFile } from "@/types/upload-types";
import { SRPGeoJsonPipelineMachineContext } from "@/utils/srp-geojson-pipeline-machine";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGeoJSONFeatureParser } from "@/hooks/use-geojson-feature-parser";
import { Input } from "../ui/input";
import { useSRPGeoJSONPipelineExecutor } from "@/hooks/srp-pipelines/use-srp-geojson-pipeline-executor";
import { useSRPGEOJSONPipelineState } from "@/hooks/srp-pipelines/use-srp-geojson-pipeline-state";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { cn } from "@/lib/utils";
const steps = [
  { label: "Select GeoJSON Files" },
  { label: "Filter Target Property" },
  { label: "Transform Target Property Key" },
] satisfies StepItem[];

type SelectGeoJSONFilesProps = {
  updateFiles: (files: UploadedFile[]) => void;
};

const SelectGeoJSONFiles = ({ updateFiles }: SelectGeoJSONFilesProps) => {
  const { uploadedFiles, isUploading, progresses, uploadFiles, reset } =
    useLocalUpload();

  useEffect(() => {
    updateFiles(uploadedFiles);
  }, [updateFiles, uploadedFiles]);

  return (
    <div className="flex items-center justify-center my-4 border bg-secondary text-primary rounded-md">
      {uploadedFiles.length <= 0 && (
        <div className="grow">
          <FileUploader
            maxFiles={1000}
            maxSize={4 * 1024 * 1024}
            progresses={progresses}
            onUpload={uploadFiles}
            disabled={isUploading}
            accept={{
              "application/geo+json": [".geojson"],
              "application/json": [".json"],
            }}
          />
        </div>
      )}
      {uploadedFiles.length > 0 && (
        <div className="h-40 w-40 grow flex items-center justify-center gap-4">
          <div className="text-lg font-semibold">
            {uploadedFiles.length} file(s) uploaded
          </div>
          <Button
            size="sm"
            onClick={() => {
              reset();
            }}
          >
            Remove All
          </Button>
        </div>
      )}
    </div>
  );
};

type FilterTargetPropertyProps = {
  state: SRPGeoJsonPipelineMachineContext | null;
  updateFilterPropertyKey: (key: string) => void;
};

const FilterTargetProperty = ({
  state,
  updateFilterPropertyKey,
}: FilterTargetPropertyProps) => {
  const { featureCollection } = useGeoJSONFeatureParser({
    uploadedFiles: state?.inputFiles,
  });
  const [properties, setProperties] = useState<Record<string, string[]>>({});

  useEffect(() => {
    // extract all properties from the feature collection
    if (!featureCollection) {
      return;
    }

    const properties: Record<string, string[]> = {};

    featureCollection.features.forEach((feature) => {
      Object.keys(feature.properties || []).forEach((key) => {
        if (!properties[key]) {
          properties[key] = [];
        }

        if (feature.properties === null) {
          return;
        }

        if (properties[key].indexOf(feature.properties[key]) < 0) {
          properties[key].push(feature.properties[key]);
        }
      });
    });

    setProperties(properties);
  }, [featureCollection]);

  if (!state) {
    return null;
  }

  const inputFiles = state.inputFiles;

  if (inputFiles.length <= 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-center my-4 border bg-secondary text-primary rounded-md">
      <div className="grow h-40 flex items-center justify-center gap-4">
        <Select
          onValueChange={(value) => {
            updateFilterPropertyKey(value);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter Property Key" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(properties).map((property) => (
              <SelectItem key={property} value={property}>
                {property}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

type TransformTargetPropertyProps = {
  updateTransformedPropertyKey: (key: string) => void;
};

const TransformTargetProperty = ({
  updateTransformedPropertyKey,
}: TransformTargetPropertyProps) => {
  const [targetPropertyKey, setTargetPropertyKey] = useState<string | null>("");

  useEffect(() => {
    if (!targetPropertyKey) {
      return;
    }
    updateTransformedPropertyKey(targetPropertyKey);
  }, [targetPropertyKey, updateTransformedPropertyKey]);
  return (
    <div className="flex items-center justify-center my-4 border bg-secondary text-primary rounded-md">
      <div className="grow h-40 flex items-center justify-center">
        <div className="w-1/4 p-4">
          <Input
            onChange={(e) => setTargetPropertyKey(e.target.value)}
            placeholder="Transformed Property Key"
          />
        </div>
      </div>
    </div>
  );
};

export function SRPGeoJsonPipelineTool() {
  const {
    updateFiles,
    updateFilterPropertyKey,
    updateTransformedPropertyKey,
    state,
  } = useSRPGEOJSONPipelineState();
  return (
    <div className="flex w-full flex-col gap-4 mt-4">
      <Stepper initialStep={0} steps={steps} orientation="vertical">
        {steps.map(({ label }, index) => {
          return (
            <Step key={label} label={label}>
              {index === 0 ? (
                <SelectGeoJSONFiles updateFiles={updateFiles} />
              ) : null}
              {index === 1 ? (
                <FilterTargetProperty
                  state={state}
                  updateFilterPropertyKey={updateFilterPropertyKey}
                />
              ) : null}
              {index === 2 ? (
                <TransformTargetProperty
                  updateTransformedPropertyKey={updateTransformedPropertyKey}
                />
              ) : null}
            </Step>
          );
        })}
        <Footer state={state} />
      </Stepper>
    </div>
  );
}

type FooterProps = {
  state: SRPGeoJsonPipelineMachineContext | null;
};

const Footer = ({ state }: FooterProps) => {
  const {
    nextStep,
    prevStep,
    resetSteps,
    isDisabledStep,
    hasCompletedAllSteps,
    isLastStep,
    isOptionalStep,
  } = useStepper();
  const handleError = (error: Error) => {
    alert(error.message);
  };
  const { execute } = useSRPGeoJSONPipelineExecutor({
    context: state,
    handleError,
  });

  const [isLoading, setIsLoading] = useState(false);

  const download = () => {
    setIsLoading(true);
    // execute the pipeline
    const featureCollections = execute();

    if (!featureCollections) {
      alert("No feature collections found");
      return;
    }

    const createAndDownloadZip = async () => {
      // use jszip to create a zip file
      const zip = new JSZip();
      featureCollections.forEach((featureCollection, index) => {
        const blob = new Blob([JSON.stringify(featureCollection)], {
          type: "application/geo+json",
        });

        const name =
          featureCollection.features[0].properties?.[
            state?.transformedPropertyKey || index.toString()
          ];

        zip.file(`${name}.geojson`, blob);
      });

      zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, "srp-geojson-pipeline-results.zip");
      });
    };

    createAndDownloadZip().then(() => {
      setIsLoading(false);
    });
  };

  return (
    <>
      {hasCompletedAllSteps && (
        <div className="my-4 border bg-secondary text-primary rounded-md gap-4 flex items-center justify-center">
          <div className="flex items-center justify-center flex-col gap-4 p-4">
            <h1 className="text-xl">Download Results</h1>
            <div>
              {isLoading ? (
                <LoadingSpinner className={""} />
              ) : (
                <Button size="sm" onClick={download}>
                  Download
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="w-full flex justify-end gap-2">
        {hasCompletedAllSteps ? (
          <Button size="sm" onClick={resetSteps}>
            Reset
          </Button>
        ) : (
          <>
            <Button
              disabled={isDisabledStep}
              onClick={prevStep}
              size="sm"
              variant="secondary"
            >
              Prev
            </Button>
            <Button size="sm" onClick={nextStep}>
              {isLastStep ? "Finish" : isOptionalStep ? "Skip" : "Next"}
            </Button>
          </>
        )}
      </div>
    </>
  );
};

const LoadingSpinner = ({ className }: { className: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("animate-spin", className)}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
};
