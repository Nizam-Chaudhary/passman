import { env } from "./env";

export default new Bun.S3Client({
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  bucket: env.S3_BUCKET,
});
