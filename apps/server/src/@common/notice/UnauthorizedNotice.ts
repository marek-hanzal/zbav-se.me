import type { NoticeSchema } from "~/schema/NoticeSchema";

export const UnauthorizedNotice: NoticeSchema.Type = {
	type: "error",
	message: "Shooooo! Shooo!",
};
