import { Effect } from "effect";
import type { ReactNode } from "react";
import { renderMailFx } from "./renderMailFx";
import { sendFx } from "./sendFx";

export namespace mailtoFx {
	export interface Props {
		to: string[];
		title: string;
		content: ReactNode;
		refId?: string;
		keyId?: string;
	}
}

export const mailtoFx = Effect.fn("mailtoFx")(function* ({
	to,
	title,
	content,
	refId,
	keyId,
}: mailtoFx.Props) {
	const { html, text } = yield* renderMailFx({
		content,
	});

	return yield* sendFx({
		to,
		title,
		html,
		text,
		refId,
		keyId,
	});
});
