import { createFileRoute } from "@tanstack/react-router";
import { Logo } from "~/app/ui/Logo/Logo";

export const Route = createFileRoute("/$locale/")({
	ssr: false,
	component() {
		return (
			<div className="flex flex-col items-center justify-center h-screen">
				<Logo/>
			</div>
		);
	},
});
