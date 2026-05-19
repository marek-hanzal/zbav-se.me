import { Effect } from "effect";
import type { ReactNode } from "react";
import { renderMailFx } from "./renderMailFx";
import { sendFx } from "./sendFx";

export namespace mailtoFx {
	export interface Props {
		to: string[];
		title: string;
		content: ReactNode;
	}
}

export const mailtoFx = Effect.fn("mailtoFx")(function* ({ to, title, content }: mailtoFx.Props) {
	const { html, text } = yield* renderMailFx({
		content,
	});

	return yield* sendFx({
		to,
		title,
		html,
		text,
	});
});
