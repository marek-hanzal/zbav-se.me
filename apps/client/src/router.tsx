import { keepPreviousData, QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { routeTree } from "~/_route";
import { Sheet } from "~/app/sheet/Sheet";
import { Logo } from "~/app/ui/Logo";
import { PrimaryOverlay } from "~/app/ui/overlay/PrimaryOverlay";

export function getRouter() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				placeholderData: keepPreviousData,
				staleTime: 5 * 1000,
			},
		},
	});

	const router = createRouter({
		routeTree,
		context: {
			queryClient,
		},
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
