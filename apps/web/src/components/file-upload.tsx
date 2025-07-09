import { toast } from "sonner";

import type { FileUploadResponse } from "@/schema/file";

import { useUploadFile } from "@/services/mutations/file";

import { Input } from "./ui/input";

interface Props {
  onSuccess: (data: FileUploadResponse, variables?: { file: File }, context?: unknown) => void;
}

function FileUpload({ onSuccess }: Props): React.ReactElement {
  const uploadFileMutation = useUploadFile();
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    toast.info("Uploading file...");

    uploadFileMutation.mutate(
      { file },
      {
        onSuccess,
      },
    );
  };

  return (
    <>
      <Input
        id="file-upload"
        type="file"
        onChange={onChange}
        className="hidden border p-2"
        disabled={uploadFileMutation.isPending}
      />
    </>
  );
}

export default FileUpload;
