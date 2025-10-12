import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@use-pico/client";

export const Route = createFileRoute("/$locale/tos")({
	component() {
		return (
			<Container
				layout={"vertical"}
				overflow={"vertical"}
			>
				The boring stuff here
			</Container>
		);
	},
});
