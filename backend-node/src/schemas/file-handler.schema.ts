import z from "zod";

export const FileUploadSchema = z.object({
  file: z.instanceof(Buffer),
  password: z.string().min(1, "Password cannot be empty"),
});

export type FileUpload = z.infer<typeof FileUploadSchema>;