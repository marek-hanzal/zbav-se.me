import { createFileRoute } from "@tanstack/react-router";
import { Sheet } from "~/app/sheet/Sheet";

export const Route = createFileRoute("/$locale/app/dashboard")({
	component() {
		return <Sheet>Tiles will be here, bro!</Sheet>;
	},
});
