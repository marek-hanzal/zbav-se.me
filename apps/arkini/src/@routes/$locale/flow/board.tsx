import { createFileRoute } from "@tanstack/react-router";
import { withBoardItemCollectionQuery } from "@zbav-se.me/sdk/query/arkini/board-item";
import { Board } from "~/app/board/Board";
import { BoardProvider } from "~/app/board/BoardProvider";
import { createBoardStore } from "~/app/board/createBoardStore";

export const Route = createFileRoute("/$locale/flow/board")({
	component() {
		const { data } = withBoardItemCollectionQuery.useSuspenseQuery({});
		const boardStore = createBoardStore({
			items: data.data,
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
