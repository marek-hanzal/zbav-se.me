import { createFileRoute } from "@tanstack/react-router";
import { SpinnerContainer } from "@use-pico/client/ui/container";

export const Route = createFileRoute("/$locale/buyer/transaction")({
	pendingComponent() {
		return <SpinnerContainer />;
	},
});
