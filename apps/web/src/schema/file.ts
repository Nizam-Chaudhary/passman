export interface FileDetails {
    id: number;
    url: string;
    fileKey: string;
    createdAt: string;
    updatedAt: string;
}

export interface FileUploadResponse {
    status: boolean;
    message: string;
    data: FileDetails;
}
