import type { NoticeSchema } from "~/notice/schema/NoticeSchema";

export const noticeError = (e: { message: string }): NoticeSchema.Type => {
	return {
		type: "error",
		message: e.message,
	};
};
