import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { Container, PicoCls } from "@use-pico/client";
import { TokenProvider } from "@use-pico/cls";
import axios from "axios";
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
				title: "Zbav se mě!",
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
	component() {
		/**
		 * Should be isomorphic
		 *
		 * Don't have better way, where to put this to make it work.
		 *
		 * Maybe it's OK, I'll see...
		 */
		axios.defaults.baseURL = import.meta.env.VITE_SERVER_API;
		axios.defaults.withCredentials = true;

		return (
			<html>
				<head>
					<HeadContent />
				</head>

				<body>
					<TokenProvider cls={PicoCls.use(ThemeCls)}>
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
						>
							<Outlet />
						</Container>
					</TokenProvider>

					<Scripts />
				</body>
			</html>
		);
	},
});
