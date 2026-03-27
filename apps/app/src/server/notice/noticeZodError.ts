import type { NoticeSchema } from "@use-pico/common/schema";
import { type ZodError, z } from "zod";

export const noticeZodError = (zod: ZodError): NoticeSchema.Type => {
	return {
		type: "error",
		message: z.prettifyError(zod),
	};
};
