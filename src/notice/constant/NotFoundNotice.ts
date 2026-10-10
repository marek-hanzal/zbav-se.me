import type { NoticeSchema } from "~/notice/schema/NoticeSchema";

/** Standard 404 response body (not found / restricted / missing resource). Do not leak e.message. */
export const NotFoundNotice: NoticeSchema.Type = {
	type: "error",
	message: "Nothing here",
};
