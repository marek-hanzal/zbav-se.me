import { configure, getConfig, getConsoleSink, type LogLevel } from "@logtape/logtape";
import { getPrettyFormatter } from "@logtape/pretty";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { keepPreviousData, QueryClient } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { Container } from "@/lib/client/container";
import { Logo } from "~/common/ui/logo";
import { routeTree } from "./_route";

export async function getRouter() {
	const level: LogLevel = "trace";
	const staleTime = 5 * 60 * 1_000;

	!getConfig() &&
		(await configure({
			reset: true,
			sinks: {
				console: getConsoleSink({
					formatter: getPrettyFormatter({
						categoryWidth: 42,
						properties: true,
						timestamp: "date-time-tz",
						messageColor: "red",
						messageStyle: "bold",
						levelStyle: "reset",
						inspectOptions: {
							colors: true,
						},
					}),
					nonBlocking: true,
				}),
			},
			loggers: [
				{
					/**
					 * Root logger
					 */
					category: [],
					lowestLevel: level,
					sinks: [
						"console",
					],
				},

				{
					category: [
						"logtape",
						"meta",
					],
					lowestLevel: "error",
					sinks: [],
				},
			],
		}));

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				placeholderData: keepPreviousData,
				staleTime,
				gcTime: staleTime * 2,
				refetchOnWindowFocus: true,
				refetchOnReconnect: true,
				refetchOnMount: true,
			},
		},
	});

	const router = createRouter({
		routeTree,
		context: {
			queryClient,
		},
		defaultPreload: "intent",
		defaultNotFoundComponent() {
			return (
				<Container
					data-ui-layout="vertical-centered"
					data-ui-height="full"
				>
					<div>4😞4</div>
				</Container>
			);
		},
		defaultPendingComponent() {
			return (
				<Container
					data-ui-layout="vertical-centered"
					data-ui-height="full"
				>
					<Logo logo />
				</Container>
			);
		},
		defaultPendingMs: 100,
		scrollRestoration: true,
	});

	persistQueryClient({
		queryClient,
		persister: createAsyncStoragePersister({
			storage: typeof window === "undefined" ? undefined : window.sessionStorage,
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
