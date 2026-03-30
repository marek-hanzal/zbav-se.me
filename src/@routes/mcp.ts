import { createFileRoute } from "@tanstack/react-router";
import type { NoticeSchema } from "@/lib/common/schema";

export const Route = createFileRoute("/mcp")({
	server: {
		handlers: {
			async GET() {
				return Response.json({
					type: "warning",
					message: "Don't worry, we're working on it!",
				} satisfies NoticeSchema.Type);
			},
		},
	},
});
