import { createFileRoute } from "@tanstack/react-router";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Container } from "~/ui/ui/Container";
import { Status } from "~/ui/ui/Status";

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
