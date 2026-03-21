import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LocalePage } from "~/app/@common/locale/~public/LocalePage";

export const Route = createFileRoute("/$locale")({
	// ssr: false,
	async loader({ params: { locale } }) {
		try {
			return {
				translations: (await import(`../translation/${locale}.yaml`)).default,
			} as const;
		} catch {
			console.warn(`Locale [${locale}] not found, using default locale`);
			return {
				translations: (await import(`../translation/cs.yaml`)).default,
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
