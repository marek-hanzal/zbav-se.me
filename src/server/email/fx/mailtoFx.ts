import { Effect } from "effect";
import type { ReactNode } from "react";
import { Resend } from "resend";
import { getLoggerFx } from "@/lib/common/log";
import { MailContextFx } from "../context/MailContextFx";
import { MailErrorFx } from "../error/MailErrorFx";

export namespace mailtoFx {
	export interface Props {
		to: string[];
		title: string;
		content: ReactNode;
	}
}

export const mailtoFx = Effect.fn("mailtoFx")(function* ({ to, title, content }: mailtoFx.Props) {
	const mailContext = yield* MailContextFx;
	const logger = yield* getLoggerFx("mailtoFx", "server-email");

	const { data, error } = yield* Effect.tryPromise({
		try: async () => {
			const resend = new Resend(mailContext.key);

			return resend.emails.send({
				from: mailContext.from,
				to,
				subject: title,
				react: content,
			});
		},
		catch: (error) => {
			logger.error("Resend email send threw", {
				error,
				title,
				to,
			});

			return new MailErrorFx({
				message: error instanceof Error ? error.message : "Failed to send email",
			});
		},
	});

	if (error) {
		yield* Effect.sync(() => {
			logger.error("Resend email send failed", {
				error,
				title,
				to,
			});
		});

		return yield* new MailErrorFx({
			message: error.message,
		});
	}

	return data;
});
