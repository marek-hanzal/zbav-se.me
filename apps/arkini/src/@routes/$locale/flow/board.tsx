import { createFileRoute } from "@tanstack/react-router";
import { withBoardItemsQuery } from "@zbav-se.me/sdk/query/arkini/board";
import { Board } from "~/app/board/Board";
import { BoardProvider } from "~/app/board/BoardProvider";
import { createBoardStore } from "~/app/board/createBoardStore";

export const Route = createFileRoute("/$locale/flow/board")({
	component() {
		const { data: items } = withBoardItemsQuery.useSuspenseQuery();
		const boardStore = createBoardStore({
			items,
		});

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
