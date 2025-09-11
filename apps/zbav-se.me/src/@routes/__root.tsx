import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { PicoCls } from "@use-pico/client";
import { ClsProvider } from "@use-pico/cls";
import { MotionConfig } from "motion/react";
import { ThemeCls } from "~/app/ui/ThemeCls";
import styles from "~/assets/style.css?url";

export const Route = createRootRouteWithContext<{}>()({
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
		const slots = ThemeCls.create(({ what }) => ({
			slot: what.slot({
				default: what.both(
					[
						"h-[100dvh]",
						"max-h-[100dvh]",
						"overscroll-none",
					],
					[
						"square.sm",
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
				<body className={slots.default()}>
					<ClsProvider value={PicoCls.use(ThemeCls)}>
						<MotionConfig reducedMotion="never">
							<Outlet />
						</MotionConfig>
					</ClsProvider>

					<Scripts />
				</body>
			</html>
		);
	},
});
