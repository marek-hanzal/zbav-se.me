import { type ZodError, z } from "zod";
import type { NoticeSchema } from "~/schema/NoticeSchema";

export const noticeZodError = (zod: ZodError): NoticeSchema.Type => {
	return {
		type: "error",
		message: z.prettifyError(zod),
	};
};
