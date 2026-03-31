import type { NoticeSchema } from "@/lib/common/schema";

/** Standard 404 response body (not found / restricted / missing resource). Do not leak e.message. */
export const NotFoundNotice: NoticeSchema.Type = {
	type: "error",
	message: "Nothing here",
};
