import { createFileRoute, redirect } from "@tanstack/react-router";
import { getLocaleFn } from "~/common/locale/getLocaleFn";
import { withSessionQuery } from "~/user/auth/query/withSessionQuery";

export const Route = createFileRoute("/")({
	async loader({ context: { queryClient } }) {
		const locale = await getLocaleFn();
		const sessionQuery = await withSessionQuery.ensure(
			queryClient,
			"No input data here, bro!",
			{
				staleTime: 0,
				throwOnError: true,
			},
		);

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
