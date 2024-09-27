export interface UploadedFile<T = unknown> {
  key: string;
  url: string;
  name: string;
  type: string;
  size: number;
  data: T;
}
