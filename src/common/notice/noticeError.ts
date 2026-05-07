import type { NoticeSchema } from "@/lib/common/schema";

export const noticeError = (e: { message: string }): NoticeSchema.Type => {
	return {
		type: "error",
		message: e.message,
	};
};
