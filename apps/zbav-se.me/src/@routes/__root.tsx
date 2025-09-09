import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { type PageCls, PicoCls } from "@use-pico/client";
import { ClsProvider } from "@use-pico/cls";
import { MotionConfig } from "motion/react";
import { client, trpc } from "~/app/trpc/client/trpc";
import { PageTransition } from "~/app/ui/PageTransition";
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
	shellComponent() {
		const { queryClient } = Route.useRouteContext();

		const slots = ThemeCls.create(({ what }) => ({
			slot: what.slot({
				default: what.both(
					[
						"p-4",
						"h-screen",
						"min-h-screen",
					],
					[
						"tone.primary.dark.bg",
					],
				),
			}),
		}));

		return (
			<html>
				<head>
					<HeadContent />
				</head>
				<body className="overscroll-none overflow-hidden">
					<ClsProvider value={PicoCls.use(ThemeCls)}>
						<trpc.Provider
							client={client}
							queryClient={queryClient}
						>
							<div className={slots.default()}>
								<MotionConfig reducedMotion="never">
									<PageTransition/>
								</MotionConfig>
							</div>
						</trpc.Provider>
					</ClsProvider>

					<Scripts />
				</body>
			</html>
		);
	},
});
