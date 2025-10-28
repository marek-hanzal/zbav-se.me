import { createFileRoute } from "@tanstack/react-router";
import { Sheet, Status } from "@use-pico/client";

export const Route = createFileRoute("/$locale/tos")({
	component() {
		return (
			<Sheet>
				<Status
					textTitle={"ToS not available in this language (title)"}
					textMessage={
						"ToS not available in this language (description)"
					}
				/>
			</Sheet>
		);
	},
});
