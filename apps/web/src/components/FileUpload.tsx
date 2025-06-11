import { useToast } from "@/hooks/use-toast";
import { Input } from "./ui/input";
import type { FileUploadResponse } from "@/schema/file";
import { useUploadFile } from "@/services/mutations/file";

interface Props {
    onSuccess: (
        data: FileUploadResponse,
        variables?: { file: File },
        context?: unknown
    ) => void;
}

function FileUpload({ onSuccess }: Props): React.ReactElement {
    const uploadFileMutation = useUploadFile();
    const { toast } = useToast();
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        toast({
            title: "Uploading file...",
            className: "bg-green-600 text-white",
        });

        uploadFileMutation.mutate(
            { file },
            {
                onSuccess,
            }
        );
    };

    return (
        <>
            <Input
                id="file-upload"
                type="file"
                onChange={onChange}
                className="border p-2 hidden"
                disabled={uploadFileMutation.isPending}
            />
        </>
    );
}

export default FileUpload;
