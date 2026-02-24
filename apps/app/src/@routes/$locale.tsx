import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { linkTo } from "@use-pico/common/link-to";
import { withSessionQuery } from "~/app/@common/auth/query/withSessionQuery";
import { LocalePage } from "~/app/@common/locale/page/LocalePage";

export const Route = createFileRoute("/$locale")({
	ssr: false,
	async beforeLoad({ params: { locale }, context: { queryClient } }) {
		const { data } = await withSessionQuery.ensure(queryClient, undefined, {
			staleTime: 0,
			gcTime: 0,
			throwOnError: true,
		});

		if (!data?.user) {
			throw redirect({
				href: linkTo({
					base: import.meta.env.VITE_WEB_ORIGIN,
					href: "/:locale/login",
					query: {
						locale,
					},
				}),
				statusCode: 302,
			});
		}

		return {
			user: data?.user,
		};
	},
	async loader({ params: { locale }, context: { user } }) {
		try {
			return {
				translations: (await import(`../translation/${locale}.yaml`)).default,
				user,
			} as const;
		} catch {
			console.warn(`Locale [${locale}] not found, using default locale`);
			return {
				translations: (await import(`../translation/cs.yaml`)).default,
				user,
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
				<Outlet />
			</LocalePage>
		);
	},
});
