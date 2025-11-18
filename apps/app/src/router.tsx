import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { keepPreviousData, QueryClient } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { Container } from "@use-pico/client/ui/container";
import { Logo } from "@zbav-se.me/ui/logo";
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
		defaultPendingMs: 500,
		scrollRestoration: true,
	});

	persistQueryClient({
		queryClient,
		persister: createAsyncStoragePersister({
			storage: typeof window !== "undefined" ? window.sessionStorage : null,
		}),
		// maxAge: 30 * 60_1000,
		maxAge: 0,
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
