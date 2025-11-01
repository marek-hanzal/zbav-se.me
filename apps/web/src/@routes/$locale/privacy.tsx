import { createFileRoute } from "@tanstack/react-router";
import { Status } from "@use-pico/client/ui/status";
import { Sheet } from "@zbav-se.me/ui";

export const Route = createFileRoute("/$locale/privacy")({
	component() {
		return (
			<Sheet>
				<Status
					textTitle={
						"Privacy policy not available in this language (title)"
					}
					textMessage={
						"Privacy policy not available in this language (description)"
					}
				/>
			</Sheet>
		);
	},
});
