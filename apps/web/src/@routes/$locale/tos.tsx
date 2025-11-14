import { createFileRoute } from "@tanstack/react-router";
import { Sheet } from "@use-pico/client/ui/sheet";
import { Status } from "@use-pico/client/ui/status";

export const Route = createFileRoute("/$locale/tos")({
	component() {
		return (
			<Sheet>
				<Status
					textTitle={"ToS not available in this language (title)"}
					textMessage={"ToS not available in this language (description)"}
				/>
			</Sheet>
		);
	},
});
