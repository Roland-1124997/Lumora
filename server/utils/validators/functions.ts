import { ZodType } from "zod";
import { z } from "zod";
export * as zod from "zod";

export const useValidateMultipartFormData = async (event: H3Event, schema: ZodType): Promise<{ [key: string]: any; files: FormDataItem[]; }> => {
    const request = await useReadMultipartFormData(event);
    const { error: zodError } = await schema.safeParseAsync(request);
    let error = null
    
    if (zodError) error = {
        ...badRequestError,
        error: {
            type: "fields",
            details: zodError.errors
        }
    }
    
    return { request, files: request.files, error }
}

export const createFilesObject = (zod: typeof z) => {
    return zod.array(
        zod.object({
            name: zod.string(),
            filename: zod.string(),
            type: zod.string().regex(/^image\/(jpeg|png)$/, "Only PNG or JPEG files are allowed"),
            data: zod.instanceof(Buffer).refine((buffer) => buffer.length <= 10 * 1024 * 1024, {
                message: "File size must not exceed 10MB",
            })
        })
    ).nonempty("This field is required");
};
