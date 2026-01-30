import { createFileRoute } from "@tanstack/react-router";
import { Board } from "~/app/board/Board";
import { BoardProvider } from "~/app/board/BoardProvider";
import { createBoardStore } from "~/app/board/createBoardStore";

export const Route = createFileRoute("/$locale/flow/board")({
	component() {
		const boardStore = createBoardStore();

		return (
			<BoardProvider store={boardStore}>
				<Board
					width={7}
					height={9}
				/>
			</BoardProvider>
		);
	},
});
