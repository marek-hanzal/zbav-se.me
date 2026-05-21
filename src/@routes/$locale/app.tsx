import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AgentRuntimeProvider } from "~/user/agent/runtime";
import { getSessionFn } from "~/user/auth/fn/getSessionFn";

export const Route = createFileRoute("/$locale/app")({
	async loader({ location, params: { locale } }) {
		const session = await getSessionFn();

		if (!session?.user) {
			const target = new URL(location.href, import.meta.env.VITE_ORIGIN).toString();

			throw redirect({
				to: "/$locale/sign-in",
				params: {
					locale,
				},
				search: {
					target,
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
