import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";

export const Route = createFileRoute("/$locale/tos")({
	component() {
		return (
			<Container>
				<Status
					textTitle={"ToS not available in this language (title)"}
					textMessage={"ToS not available in this language (description)"}
				/>
			</Container>
		);
	},
});
