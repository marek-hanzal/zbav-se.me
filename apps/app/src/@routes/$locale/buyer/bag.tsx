import { createFileRoute } from "@tanstack/react-router";
import { tvc } from "@use-pico/cls";

export const Route = createFileRoute("/$locale/buyer/bag")({
	component() {
		return (
			<div
				className={tvc([
					"grid",
					"grid-flow-row",
					"auto-rows-auto",
					"grid-cols-1",
				])}
			>
				Not yet
			</div>
		);
	},
});
