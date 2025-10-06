import { keepPreviousData, QueryClient } from "@tanstack/react-query";
import { createRouter as coolCreateRouter } from "@tanstack/react-router";
import { tvc } from "@use-pico/cls";
import { LogoAnimated } from "~/app/ui/LogoAnimated";
import { routeTree } from "./_route";

export const getRouter = () => {
	const router = coolCreateRouter({
		routeTree,
		context: {
			queryClient: new QueryClient({
				defaultOptions: {
					queries: {
						placeholderData: keepPreviousData,
						staleTime: 5 * 1000,
					},
				},
			}),
		},
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
		defaultPendingMinMs: 200,
		defaultNotFoundComponent() {
			return <div>4😞4</div>;
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
					<LogoAnimated />
				</div>
			);
		},
		defaultPendingMs: 500,
	});

	return router;
};

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
