import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@use-pico/client/ui/container";

export const Route = createFileRoute("/cs/tos")({
	component() {
		return (
			<Container
				ui={{
					layout: "vertical",
					scroll: "vertical",
					inner: "default",
				}}
			>
				yep
			</Container>
		);
	},
});
