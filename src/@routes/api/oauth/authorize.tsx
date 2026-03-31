import { createFileRoute } from "@tanstack/react-router";
import { OAuthSearchSchema } from "~/common/auth/schema/OAuthSearchSchema";

export const Route = createFileRoute("/api/oauth/authorize")({
	validateSearch: OAuthSearchSchema,
	server: {
		handlers: {
			async GET() {
				return new Response(null, {
					status: 204,
				});
			},
		},
	},
});
