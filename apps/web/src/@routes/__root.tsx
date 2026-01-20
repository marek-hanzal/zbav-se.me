import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
	useParams,
} from "@tanstack/react-router";
import { uiContainer } from "@use-pico/client/ui/container";
import styles from "~/assets/style.css?url";

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
	shellComponent() {
		const { locale } = useParams({
			from: "/$locale",
		});

		return (
			<html
				lang={locale}
				className={"bg-slate-200 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"}
			>
				<head>
					<HeadContent />
				</head>

				<body
					{...uiContainer({
						className: [
							"font-roboto",
							"w-dvw",
							"h-dvh",
							"md:mx-auto",
							"md:w-1/4",
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
