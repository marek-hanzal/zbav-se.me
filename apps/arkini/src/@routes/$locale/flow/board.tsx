import { createFileRoute } from "@tanstack/react-router";
import { Board } from "~/app/board/Board";

export const Route = createFileRoute("/$locale/flow/board")({
	component() {
		return (
			<Board
				width={7}
				height={9}
			/>
		);
	},
});
