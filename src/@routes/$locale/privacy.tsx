import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@/lib/client/container";
import { Status } from "@/lib/client/status";
import { translator } from "@/lib/common/translation";

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
