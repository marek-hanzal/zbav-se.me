import { keepPreviousData, QueryClient } from "@tanstack/react-query";
import { createRouter as coolCreateRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { PageCls } from "@use-pico/client";
import { routeTree } from "./routeTree.gen";

export const createRouter = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				placeholderData: keepPreviousData,
				staleTime: 5 * 1000,
			},
		},
	});

	const router = coolCreateRouter({
		routeTree,
		context: {
			queryClient,
			cls: PageCls,
		},
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
		defaultPendingMinMs: 200,
		defaultNotFoundComponent() {
			return <div>4😞4</div>;
		},
	});

	setupRouterSsrQueryIntegration({
		router,
		queryClient,
		wrapQueryClient: true,
	});

	return router;
};

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}
