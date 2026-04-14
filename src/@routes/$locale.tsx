import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LocalePage } from "~/common/locale/LocalePage/LocalePage";
import { defaultLocale } from "~/locales";

export const Route = createFileRoute("/$locale")({
	async loader({ params: { locale } }) {
		try {
			return {
				translations: (await import(`../translation/${locale}.yaml`)).default,
			} as const;
		} catch {
			console.warn(`Locale [${locale}] not found, using default locale`);
			return {
				translations: (await import(`../translation/${defaultLocale}.yaml`)).default,
			} as const;
		}
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
