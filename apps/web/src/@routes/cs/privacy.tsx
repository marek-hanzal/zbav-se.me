import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cs/privacy")({
	component() {
		return "privacy!";
	},
});
