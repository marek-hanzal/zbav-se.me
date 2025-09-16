import { createFileRoute } from "@tanstack/react-router";
import { Container } from "~/app/ui/container/Container";

export const Route = createFileRoute("/$locale/n/test")({
	component() {
		return (
			<Container height={"full"}>
				<div className="h-1/2">
					<Container orientation="horizontal-full">
						<Container item="full">Jebka 1</Container>
						<Container item="full">Jebka 2</Container>
						<Container item="full">Jebka 3</Container>
					</Container>
				</div>

				<div className="h-1/2">
					<Container orientation="vertical-full">
						<Container item="full">Jebka 1</Container>
						<Container item="full">Jebka 2</Container>
						<Container item="full">Jebka 3</Container>
					</Container>
				</div>
			</Container>
		);
	},
});
