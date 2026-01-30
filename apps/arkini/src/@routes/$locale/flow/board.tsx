import { createFileRoute } from "@tanstack/react-router";
import { withBoardItemCollectionQuery } from "@zbav-se.me/sdk/query/arkini";
import { Board } from "~/app/board/Board";

export const Route = createFileRoute("/$locale/flow/board")({
	component() {
		const { data } = withBoardItemCollectionQuery.useSuspenseQuery({});

		return (
			<Board
				width={7}
				height={9}
				items={data.data}
			/>
		);
	},
});
