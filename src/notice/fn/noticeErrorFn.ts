import type { NoticeSchema } from "~/notice/schema/NoticeSchema";

export const noticeErrorFn = (e: { message: string }): NoticeSchema.Type => {
	return {
		type: "error",
		message: e.message,
	};
};
