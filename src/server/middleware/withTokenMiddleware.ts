import { createMiddleware } from "@tanstack/react-start";
import type { NoticeSchema } from "@/lib/common/schema";

export namespace withTokenMiddleware {
	export interface Props {
		/**
		 * Resolve token being checked; if throws, good old 5oo is thrown.
		 */
		token(): Promise<string>;
	}
}

export const withTokenMiddleware = ({ token }: withTokenMiddleware.Props) => {
	return createMiddleware().server(async ({ request, next }) => {
		const bearer = request.headers.get("authorization");
		const unauthorized = () => {
			return new Response(
				JSON.stringify({
					type: "error",
					message: "Shoo! Shooo!!",
				} satisfies NoticeSchema.Type),
				{
					status: 401,
					headers: {
						"Content-Type": "application/json",
						"WWW-Authenticate": "Bearer",
					},
				},
			);
		};

		if (!bearer) {
			return unauthorized();
		}

		const [scheme, value, ...rest] = bearer.trim().split(/\s+/);
		if (!scheme || !value || rest.length > 0 || scheme.toLowerCase() !== "bearer") {
			return unauthorized();
		}

		const secret = await token();
		if (secret !== value) {
			return unauthorized();
		}

		return next();
	});
};
