import { createFileRoute } from "@tanstack/react-router";
import type { NoticeSchema } from "@use-pico/common/schema";
import { z } from "zod";

const CronSchema = z.enum([
	"0",
	"4",
	"8",
	"12",
	"16",
	"20",
	"hourly",
	"monthly",
	"noop",
]);

export const Route = createFileRoute("/api/$cron")({
	server: {
		handlers: {
			async POST({ params: { cron } }) {
				const tick = CronSchema.default("noop").catch("noop").parse(cron);

				return Response.json({
					type: "info",
					message: `Hello there ${tick}!`,
				} satisfies NoticeSchema.Type);
			},
		},
	},
});
