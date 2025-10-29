import { keepPreviousData, QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { Logo, Sheet } from "@zbav-se.me/ui";
import { PrimaryOverlay } from "@zbav-se.me/ui/src/overlay/PrimaryOverlay";
import { routeTree } from "~/_route";

export function getRouter() {
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
			queryClient,
		},
		defaultPreload: "render",
		defaultNotFoundComponent() {
			return <Sheet>4😞4</Sheet>;
		},
		defaultPendingComponent() {
			return (
				<Sheet>
					<PrimaryOverlay />

					<Logo />
				</Sheet>
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
