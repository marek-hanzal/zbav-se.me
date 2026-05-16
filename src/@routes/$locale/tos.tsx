import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@/lib/client/container";
import { Status } from "@/lib/client/status";
import { useTranslator } from "@/lib/client/translation";

export const Route = createFileRoute("/$locale/tos")({
	component() {
		const translator = useTranslator();
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
