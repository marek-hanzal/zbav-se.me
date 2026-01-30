import { createFileRoute } from "@tanstack/react-router";
import { withBoardItemsQuery } from "@zbav-se.me/sdk/query/arkini";
import { Board } from "~/app/board/Board";

export const Route = createFileRoute("/$locale/flow/board")({
	component() {
		const { data } = withBoardItemsQuery.useSuspenseQuery({});

		return (
			<Board
				width={7}
				height={9}
				items={data}
			/>
		);
	},
});
