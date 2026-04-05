import { createFileRoute, redirect } from "@tanstack/react-router";
import { withSessionQuery } from "~/common/auth/query/withSessionQuery";
import { getLocaleFn } from "~/common/locale/getLocaleFn";

export const Route = createFileRoute("/")({
	async loader({ context: { queryClient } }) {
		const locale = await getLocaleFn();
		const sessionQuery = await withSessionQuery.ensure(queryClient, undefined, {
			throwOnError: true,
		});

		if (sessionQuery?.user) {
			throw redirect({
				to: "/$locale/app/home",
				params: {
					locale,
				},
			});
		}

		throw redirect({
			to: "/$locale/sign-in",
			params: {
				locale,
			},
		});
	},
});
