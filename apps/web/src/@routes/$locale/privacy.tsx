import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import { translator } from "@use-pico/common/translator";

export const Route = createFileRoute("/$locale/privacy")({
	component() {
		return (
			<Container>
				<Status
					textTitle={translator.text(
						"Privacy policy not available in this language (title)",
					)}
					textMessage={translator.text(
						"Privacy policy not available in this language (description)",
					)}
				/>
			</Container>
		);
	},
});
