import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { PicoCls } from "@use-pico/client";
import { ClsProvider } from "@use-pico/cls";
import { Container } from "~/app/ui/container/Container";
import { ThemeCls } from "~/app/ui/ThemeCls";
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
				title: "zbav-se.me",
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
		const { queryClient } = Route.useRouteContext();
		// const slots = ThemeCls.create(({ what }) => ({
		// 	slot: what.slot({
		// 		default: what.both(
		// 			[
		// 				"h-[100dvh]",
		// 				"max-h-[100dvh]",
		// 				"overscroll-none",
		// 			],
		// 			[
		// 				"tone.primary.dark.bg",
		// 			],
		// 		),
		// 	}),
		// }));

		return (
			<html>
				<head>
					<HeadContent />
				</head>
				<body>
					<ClsProvider value={PicoCls.use(ThemeCls)}>
						<QueryClientProvider client={queryClient}>
							<Container
								height="dvh"
								width="dvw"
							>
								<Outlet />
							</Container>
						</QueryClientProvider>
					</ClsProvider>

					<Scripts />
				</body>
			</html>
		);
	},
});
