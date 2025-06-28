import { validFileTypesSchema } from "@passman/schema/api";
import { and, eq } from "drizzle-orm";
import { db } from "../../db/index";
import { files } from "../../db/schema";
import { env } from "../../lib/env";
import {
  BadRequestException,
  NotFoundException,
  ValidationException,
} from "../../lib/responseExceptions";
import s3 from "../../lib/s3";

class FileService {
  async uploadFile(file: File, userId: number) {
    // validate file type
    try {
      validFileTypesSchema.parse(file.type);
    } catch {
      throw new ValidationException("Invalid file type");
    }

    // Sanitize filename
    const filename = file.name
      .replace(/[^a-z0-9.-]/gi, "_") // Replace special chars with underscore
      .toLowerCase(); // Convert to lowercase

    const fileKey = `${Date.now()}-${filename}`;

    const bytesWritten = await s3.write(fileKey, file);

    if (bytesWritten !== file.size) {
      throw new BadRequestException("File upload failed");
    }

    const url = `https://${env.S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${fileKey}`;

    const [uploadedFile] = await db
      .insert(files)
      .values({
        fileKey,
        url,
        userId,
      })
      .$returningId();

    if (!uploadedFile?.id) {
      throw new BadRequestException("File upload failed");
    }

    const uploadedFileData = await db.query.files.findFirst({
      where: eq(files.id, uploadedFile.id),
    });

    if (!uploadedFileData) {
      throw new BadRequestException("File upload failed");
    }

    return {
      status: true,
      message: "File uploaded successfully",
      data: uploadedFileData,
    };
  }

  async removeFile(userId: number, id: number) {
    const file = await db.query.files.findFirst({
      where: and(eq(files.id, id), eq(files.userId, userId)),
    });

    if (!file) {
      throw new NotFoundException("File not found");
    }

    await this.deleteFileFromS3(file.fileKey);
    await db.delete(files).where(eq(files.id, id));

    return {
      status: true,
      message: "File removed successfully",
    };
  }

  async deleteFileFromS3(key: string) {
    await s3.delete(key);
  }
}

export default new FileService();
