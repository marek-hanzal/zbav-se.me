import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";

export const Route = createFileRoute("/$locale/privacy")({
	component() {
		return (
			<Container>
				<Status
					textTitle={"Privacy policy not available in this language (title)"}
					textMessage={"Privacy policy not available in this language (description)"}
				/>
			</Container>
		);
	},
});
