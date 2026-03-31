import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { getLocaleFn } from "~/common/locale/getLocaleFn";

const SearchSchema = z.record(z.string(), z.string());

export const Route = createFileRoute("/redirect/oath")({
	validateSearch(search) {
		return SearchSchema.parse(search);
	},
	loaderDeps({ search }) {
		return {
			search,
		};
	},
	async loader({ deps }) {
		const locale = await getLocaleFn();

		return redirect({
			to: "/$locale/oath",
			params: {
				locale,
			},
			search: deps.search,
		});
	},
});
