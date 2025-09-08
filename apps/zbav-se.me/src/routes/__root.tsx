import type { QueryClient } from "@tanstack/react-query";
import {
    createRootRouteWithContext,
    HeadContent,
    Outlet,
    Scripts,
} from "@tanstack/react-router";
import { PicoCls, type PageCls } from "@use-pico/client";
import { ClsProvider } from "@use-pico/cls";
import { ThemeCls } from "~/app/ThemeCls";
import "~/assets/style.css";

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
	}),
	component() {
		return (
			<html>
				<head>
					<HeadContent />
				</head>
				<body className={'bg-blue-500'}>
					<ClsProvider value={PicoCls.use(ThemeCls)}>
						<Outlet />
					</ClsProvider>
					<Scripts />
				</body>
			</html>
		);
	},
});
