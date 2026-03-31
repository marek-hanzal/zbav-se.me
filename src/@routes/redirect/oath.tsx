import { createFileRoute, redirect } from "@tanstack/react-router";
import { OAuthSearchSchema } from "~/common/auth/schema/OAuthSearchSchema";
import { getLocaleFn } from "~/common/locale/getLocaleFn";

export const Route = createFileRoute("/redirect/oath")({
	validateSearch: OAuthSearchSchema,
	loaderDeps({ search }) {
		return {
			search,
		};
	},
	async loader({ deps: { search } }) {
		const locale = await getLocaleFn();

		return redirect({
			to: "/$locale/oath",
			params: {
				locale,
			},
			search,
		});
	},
});
