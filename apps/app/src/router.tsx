import { keepPreviousData, QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { Container } from "@use-pico/client";
import { Logo, PrimaryOverlay, Sheet } from "@zbav-se.me/ui";
import { routeTree } from "~/_route";

export async function getRouter() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				placeholderData: keepPreviousData,
				staleTime: 1000 * 60,
			},
		},
	});

	const router = createRouter({
		routeTree,
		context: {
			user: null,
			queryClient,
		},
		defaultPreload: "intent",
		defaultNotFoundComponent() {
			return <Sheet>4😞4</Sheet>;
		},
		defaultPendingComponent() {
			return (
				<Container
					square={"sm"}
					position={"relative"}
					tone={"secondary"}
					theme={"light"}
				>
					<PrimaryOverlay />

					<Sheet>
						<Logo />
					</Sheet>
				</Container>
			);
		},
		defaultPendingMs: 500,
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
