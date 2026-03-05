import { createFileRoute, redirect } from "@tanstack/react-router";
import { linkTo } from "@use-pico/common/link-to";
import { z } from "zod";
import { getLocaleFn } from "~/app/locale/getLocaleFn";

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

		throw redirect({
			href: linkTo({
				href: `/${locale}/oath`,
				query: deps.search,
			}),
		});
	},
});
