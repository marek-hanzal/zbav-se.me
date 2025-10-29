import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@use-pico/client";

export const Route = createFileRoute("/$locale/buyer/bag")({
	component() {
		return <Container layout={"vertical"}>Not yet</Container>;
	},
});
