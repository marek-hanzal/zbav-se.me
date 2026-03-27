import type { NoticeSchema } from "@use-pico/common/schema";

export const noticeError = (e: { message: string }): NoticeSchema.Type => {
	return {
		type: "error",
		message: e.message,
	};
};
