import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AgentRuntimeProvider } from "~/user/agent/runtime";
import { getSessionFn } from "~/user/auth/fn/getSessionFn";

export const Route = createFileRoute("/$locale/app")({
	async loader({ params: { locale } }) {
		const session = await getSessionFn();

		if (!session?.user) {
			throw redirect({
				to: "/$locale/sign-in",
				params: {
					locale,
				},
			});
		}

		return {
			user: session.user,
		} as const;
	},
	component() {
		return (
			<AgentRuntimeProvider>
				<Outlet />
			</AgentRuntimeProvider>
		);
	},
});
