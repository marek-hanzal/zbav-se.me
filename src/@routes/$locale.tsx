import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LocalePage } from "~/common/locale/LocalePage/LocalePage";
import { withTranslationsQuery } from "~/common/translation/query/withTranslationsQuery";

export const Route = createFileRoute("/$locale")({
	component() {
		const { locale } = Route.useParams();
		const { data: translations } = withTranslationsQuery.useSuspenseQuery({
			locale,
		});

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
