import { createFileRoute } from "@tanstack/react-router";
import { translator } from "@use-pico/common/translator";
import { Container } from "@/lib/client/container";
import { Status } from "@/lib/client/status";

export const Route = createFileRoute("/$locale/tos")({
	component() {
		return (
			<Container>
				<Status
					textTitle={translator.text("ToS not available in this language (title)")}
					textMessage={translator.text(
						"ToS not available in this language (description)",
					)}
				/>
			</Container>
		);
	},
});
