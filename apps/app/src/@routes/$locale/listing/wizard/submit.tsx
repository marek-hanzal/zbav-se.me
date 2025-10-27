import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$locale/listing/wizard/submit")({
	component() {
		return "submit!";
	},
});
