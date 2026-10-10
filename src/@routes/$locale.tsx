import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LocaleContext } from "~/locale/context/LocaleContext";
import { TranslationContext } from "~/translation/context/TranslationContext";
import { withTranslationsQuery } from "~/translation/query/withTranslationsQuery";
export const Route = createFileRoute("/$locale")({
	component() {
		const { locale } = Route.useParams();
		const { data: translations } = withTranslationsQuery.useSuspenseQuery({
			locale,
		});
		return (
			<LocaleContext
				value={{
					locale,
				}}
			>
				<TranslationContext value={translations}>
					<Outlet />
				</TranslationContext>
			</LocaleContext>
		);
	},
});
