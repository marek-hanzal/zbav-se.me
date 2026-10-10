import { type ZodError, z } from "zod";
import type { NoticeSchema } from "~/notice/schema/NoticeSchema";

export const noticeZodErrorFn = (zod: ZodError): NoticeSchema.Type => {
	return {
		type: "error",
		message: z.prettifyError(zod),
	};
};
