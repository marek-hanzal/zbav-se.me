import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { type PageCls, PicoCls } from "@use-pico/client";
import { ClsProvider } from "@use-pico/cls";
import { client, trpc } from "~/app/trpc/client/trpc";
import { ThemeCls } from "~/app/ui/ThemeCls";
import styles from "~/assets/style.css?url";

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
	cls: PageCls;
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
	component() {
		const { queryClient } = Route.useRouteContext();

		const slots = ThemeCls.create(({ what }) => ({
			slot: what.slot({
				default: what.token([
					"tone.primary.dark.bg",
				]),
			}),
		}));

		return (
			<html>
				<head>
					<HeadContent />
				</head>
				<body className="overscroll-none">
					<ClsProvider value={PicoCls.use(ThemeCls)}>
						<trpc.Provider
							client={client}
							queryClient={queryClient}
						>
							<div className={slots.default()}>
								<Outlet />
							</div>
						</trpc.Provider>
					</ClsProvider>
					<Scripts />
				</body>
			</html>
		);
	},
});
