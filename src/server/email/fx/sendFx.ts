import { Effect } from "effect";
import nodemailer from "nodemailer";
import { getLoggerFx } from "@/lib/common/log";
import { MailContextFx } from "../context/MailContextFx";
import { MailErrorFx } from "../error/MailErrorFx";

export namespace sendFx {
	export interface Props {
		to: string[];
		title: string;
		html: string;
		text: string;
		refId?: string;
		keyId?: string;
	}
}

export const sendFx = Effect.fn("sendFx")(function* ({
	to,
	title,
	html,
	text,
	refId,
	keyId,
}: sendFx.Props) {
	const mailContext = yield* MailContextFx;
	const logger = yield* getLoggerFx("sendFx", "server-email");
	const headers = {
		...(refId
			? {
					"X-Entity-Ref-ID": refId,
				}
			: {}),
		...(keyId
			? {
					"Resend-Idempotency-Key": keyId,
				}
			: {}),
	};
	const message = {
		from: mailContext.from,
		to,
		subject: title,
		html,
		text,
		...(Object.keys(headers).length
			? {
					headers,
				}
			: {}),
	};

	return yield* Effect.tryPromise({
		try: async () => {
			const transporter = nodemailer.createTransport({
				host: mailContext.host,
				port: mailContext.port,
				secure: mailContext.port === 465 || mailContext.port === 2465,
				auth: {
					user: mailContext.username,
					pass: mailContext.password,
				},
			});

			return transporter.sendMail(message);
		},
		catch: (error) => {
			logger.error("SMTP email send failed", {
				error,
				title,
				to,
			});

			return new MailErrorFx({
				message: error instanceof Error ? error.message : "Failed to send email",
			});
		},
	});
});
