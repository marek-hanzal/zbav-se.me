import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import styles from "~/assets/style.css?url";
import { getLocaleFn } from "~/locale/fn/getLocaleFn";
import { uiContainerFn } from "~/ui/fn/uiContainerFn";

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
}>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Zbav se mě!",
			},
			{
				name: "referrer",
				content: "strict-origin-when-cross-origin",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: styles,
				type: "text/css",
			},
		],
	}),
	async loader() {
		return {
			locale: await getLocaleFn(),
		};
	},
	shellComponent() {
		const { locale } = Route.useLoaderData();

		return (
			<html
				lang={locale}
				className={"bg-slate-200"}
			>
				<head>
					<HeadContent />
				</head>

				<body
					{...uiContainerFn({
						className: [
							"font-roboto",
							"w-dvw",
							"h-dvh",
						],
					})}
				>
					<Outlet />
					<Scripts />
				</body>
			</html>
		);
	},
});
