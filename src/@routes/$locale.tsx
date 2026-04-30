import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LocalePage } from "~/common/locale/LocalePage/LocalePage";
import { withTranslationsQuery } from "~/common/translation/query/withTranslationsQuery";

export const Route = createFileRoute("/$locale")({
	async loader({ params: { locale }, context: { queryClient } }) {
		return {
			translations: await withTranslationsQuery.ensure(queryClient, {
				locale,
			}),
		};
	},
	component() {
		const { locale } = Route.useParams();
		const { translations } = Route.useLoaderData();

		return (
			<LocalePage
				locale={locale}
				translations={translations}
			>
				{/* <WarmupCache _suspense={"I know"} /> */}

				<Outlet />
			</LocalePage>
		);
	},
});
