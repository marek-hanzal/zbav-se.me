import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LocaleContext } from "@/lib/client/locale";
import { TranslationContext } from "@/lib/client/translation";
import { withTranslationsQuery } from "~/common/translation/query/withTranslationsQuery";
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
