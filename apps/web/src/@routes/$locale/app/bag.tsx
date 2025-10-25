import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@use-pico/client";

export const Route = createFileRoute("/$locale/app/bag")({
	component() {
		return <Container layout={"vertical"}>Not yet</Container>;
	},
});
