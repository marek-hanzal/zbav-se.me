import { createFileRoute, redirect } from "@tanstack/react-router";
import { withSessionQuery } from "~/server/auth/query/withSessionQuery";

export const Route = createFileRoute("/$locale/app")({
	async loader({ context: { queryClient }, params: { locale } }) {
		const sessionQuery = await withSessionQuery.ensure(queryClient, undefined, {
			throwOnError: true,
		});

		if (!sessionQuery?.user) {
			throw redirect({
				to: "/$locale/sign-in",
				params: {
					locale,
				},
			});
		}

		return {
			user: sessionQuery.user,
		} as const;
	},
});
