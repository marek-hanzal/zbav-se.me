import { createMiddleware } from "@tanstack/react-start";
import type { NoticeSchema } from "~/notice/schema/NoticeSchema";

export namespace withTokenMiddlewareFn {
	export interface Props {
		/**
		 * Resolve token being checked; if throws, good old 5oo is thrown.
		 */
		tokenFn(): Promise<string>;
	}
}

export const withTokenMiddlewareFn = ({ tokenFn }: withTokenMiddlewareFn.Props) => {
	return createMiddleware().server(async ({ request, next: nextFn }) => {
		const bearer = request.headers.get("authorization");
		const unauthorizedFn = () => {
			return Response.json(
				{
					type: "error",
					message: "Shoo! Shooo!!",
				} satisfies NoticeSchema.Type,
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
			return unauthorizedFn();
		}

		const [scheme, value, ...rest] = bearer.trim().split(/\s+/);
		if (!scheme || !value || rest.length > 0 || scheme.toLowerCase() !== "bearer") {
			return unauthorizedFn();
		}

		const secret = await tokenFn();
		if (secret !== value) {
			return unauthorizedFn();
		}

		return nextFn();
	});
};
