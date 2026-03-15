import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { linkTo } from "@use-pico/common/link-to";
import { withSessionQuery } from "~/app/@common/auth/query/withSessionQuery";
import { WarmupCache } from "~/app/@common/cache/WarmupCache";
import { LocalePage } from "~/app/@common/locale/~public/LocalePage";

export const Route = createFileRoute("/$locale")({
	ssr: false,
	async loader({ params: { locale }, context: { queryClient } }) {
		const { data: session } = await withSessionQuery.ensure(queryClient, undefined, {
			staleTime: 0,
			gcTime: 0,
			throwOnError: true,
		});

		if (!session?.user) {
			throw redirect({
				href: linkTo({
					base: import.meta.env.VITE_WEB_ORIGIN,
					href: "/redirect/login",
					query: {
						locale,
					},
				}),
				statusCode: 302,
			});
		}

		try {
			return {
				translations: (await import(`../translation/${locale}.yaml`)).default,
				user: session.user,
			} as const;
		} catch {
			console.warn(`Locale [${locale}] not found, using default locale`);
			return {
				translations: (await import(`../translation/cs.yaml`)).default,
				user: session.user,
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
				<WarmupCache _suspense={"I know"} />

				<Outlet />
			</LocalePage>
		);
	},
});
