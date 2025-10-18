import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@use-pico/client";

export const Route = createFileRoute("/$locale/app/feed")({
	component() {
		return (
			<Container layout={"vertical-header-content-footer"}>
				not yet
			</Container>
		);
	},
});
