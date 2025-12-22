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
					ui={{
						layout: "vertical-centered",
						height: "full",
					}}
				>
					<div>4😞4</div>
				</Container>
			);
		},
		defaultPendingComponent() {
			return (
				<Container
					ui={{
						layout: "vertical-centered",
						height: "full",
					}}
				>
					<Logo />
				</Container>
			);
		},
		defaultPendingMs: 100,
		scrollRestoration: true,
		//
		// defaultViewTransition: true,
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
