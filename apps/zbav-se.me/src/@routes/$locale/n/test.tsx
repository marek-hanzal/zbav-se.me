import { createFileRoute } from "@tanstack/react-router";
import { Container } from "~/app/ui/container/Container";

export const Route = createFileRoute("/$locale/n/test")({
	component() {
		return (
			<Container orientation="vertical">
				<Container item="row">Jebka 1</Container>
				<Container item="row">Jebka 2</Container>
				<Container item="row">Jebka 3</Container>
			</Container>
		);
	},
});
