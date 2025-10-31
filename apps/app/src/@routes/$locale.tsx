import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { linkTo, translator } from "@use-pico/common";
import { PrimaryOverlay } from "@zbav-se.me/ui";
import { withSessionQuery } from "~/app/auth/query/withSessionQuery";

export const Route = createFileRoute("/$locale")({
	async beforeLoad({ params: { locale }, context: { queryClient } }) {
		const { data } = await withSessionQuery.ensure(queryClient, undefined, {
			staleTime: 0,
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
				translations: (await import(`../translation/${locale}.yaml`))
					.default,
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
		/**
		 * Ugly as hell, but for now I don't have better solution how to do this
		 * both on server and client side.
		 *
		 * The core idea is this route won't re-render, to it's quite safe to use it
		 * this way (out of effect and so on).
		 */
		translator.push(Route.useLoaderData().translations);

		return (
			<div className={"relative w-full h-full"}>
				<PrimaryOverlay />

				<Outlet />
			</div>
		);
	},
});
