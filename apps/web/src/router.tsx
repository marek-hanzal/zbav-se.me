import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { Container } from "@use-pico/client/ui/container";
import { Logo } from "@zbav-se.me/ui/logo";
import { routeTree } from "~/_route";

export function getRouter() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 0,
				gcTime: 0,
				refetchOnWindowFocus: true,
			},
		},
	});

	const router = createRouter({
		routeTree,
		context: {
			queryClient,
		},
		defaultPreload: "render",
		defaultNotFoundComponent() {
			return (
				<Container
					layout="vertical-centered"
					items={"center"}
				>
					<div>4😞4</div>
				</Container>
			);
		},
		defaultPendingComponent() {
			return (
				<Container
					layout={"vertical-centered"}
					items={"center"}
					tone={"secondary"}
					theme={"light"}
				>
					<Logo />
				</Container>
			);
		},
		defaultPendingMs: 100,
		scrollRestoration: true,
	});

	setupRouterSsrQueryIntegration({
		router,
		queryClient,
		wrapQueryClient: true,
	});

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
