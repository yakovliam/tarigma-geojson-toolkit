import { UploadedFile } from "@/types/upload-types";
import { nanoid } from "nanoid";
import { useState } from "react";

type UseLocalUploadResponse = {
  uploadFiles: (files: File[]) => Promise<void>;
  progresses?: Record<string, number>;
  uploadedFiles: UploadedFile[];
  isUploading: boolean;
  reset: () => void;
  removeFile: (key: string) => void;
};

export const useLocalUpload = (): UseLocalUploadResponse => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progresses] = useState<Record<string, number>>({});

  const uploadFiles = async (files: File[]): Promise<void> => {
    setIsUploading(true);

    const newUploadedFiles = await Promise.all(
      files.map(async (file) => {
        const key = nanoid();
        const url = URL.createObjectURL(file);

        return {
          key,
          url,
          name: file.name,
          type: file.type,
          size: file.size,
          data: await new Response(file).text(),
        };
      }),
    );

    setUploadedFiles([...uploadedFiles, ...newUploadedFiles]);
    setIsUploading(false);

    return Promise.resolve();
  };

  const reset = () => {
    setUploadedFiles([]);
  };

  const removeFile = (key: string) => {
    setUploadedFiles(uploadedFiles.filter((file) => file.key !== key));
  };

  return {
    uploadFiles,
    progresses,
    uploadedFiles,
    isUploading,
    reset,
    removeFile,
  };
};
