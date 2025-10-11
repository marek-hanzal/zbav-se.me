import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { Container, PicoCls } from "@use-pico/client";
import { TokenProvider } from "@use-pico/cls";
import axios from "axios";
import { ThemeCls } from "~/app/ui/ThemeCls";
import "~/assets/style.css";

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
}>()({
	async beforeLoad() {
		axios.defaults.baseURL = import.meta.env.VITE_API;
		axios.defaults.withCredentials = true;
	},
	component() {
		const { queryClient } = Route.useRouteContext();

		return (
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
		);
	},
});
