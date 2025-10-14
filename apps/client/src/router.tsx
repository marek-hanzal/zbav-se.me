import { keepPreviousData, QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { tvc } from "@use-pico/cls";
import { routeTree } from "~/_route";
import { Sheet } from "~/app/sheet/Sheet";
import { Logo } from "~/app/ui/Logo";

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
		scrollRestoration: true,
		defaultNotFoundComponent() {
			return <Sheet>4😞4</Sheet>;
		},
		defaultPendingComponent() {
			return (
				<div
					className={tvc([
						"fixed",
						"inset-0",
						"flex",
						"items-center",
						"justify-center",
					])}
				>
					<Logo />
				</div>
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
