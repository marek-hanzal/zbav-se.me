import { render, toPlainText } from "@react-email/render";
import { Effect } from "effect";
import type { ReactNode } from "react";
import { getLoggerFx } from "@/lib/common/log";
import { MailErrorFx } from "../error/MailErrorFx";

export namespace renderMailFx {
	export interface Props {
		content: ReactNode;
	}

	export interface Output {
		html: string;
		text: string;
	}
}

export const renderMailFx = Effect.fn("renderMailFx")(function* ({ content }: renderMailFx.Props) {
	const logger = yield* getLoggerFx("renderMailFx", "server-email");

	return yield* Effect.tryPromise({
		try: async () => {
			const html = await render(content);
			const text = toPlainText(html);

			return {
				html,
				text,
			} satisfies renderMailFx.Output;
		},
		catch: (error) => {
			logger.error("Email render failed", {
				error,
			});

			return new MailErrorFx({
				message: error instanceof Error ? error.message : "Failed to render email",
			});
		},
	});
});
