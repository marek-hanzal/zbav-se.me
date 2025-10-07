import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { Container, PicoCls } from "@use-pico/client";
import { TokenProvider } from "@use-pico/cls";
import { ThemeCls } from "~/app/ui/ThemeCls";
import styles from "~/assets/style.css?url";

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
}>()({
	ssr: false,
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

		return (
			<html>
				<head>
					<HeadContent />
				</head>

				<body>
					<TokenProvider cls={PicoCls.use(ThemeCls)}>
						<QueryClientProvider client={queryClient}>
							<Container
								height="dvh"
								width="full"
								tweak={{
									slot: {
										root: {
											token: [
												"tone.primary.dark.bg",
											],
										},
									},
								}}
								square={"sm"}
							>
								<Outlet />
							</Container>
						</QueryClientProvider>
					</TokenProvider>

					<Scripts />
				</body>
			</html>
		);
	},
});
