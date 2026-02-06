import type { FC, PropsWithChildren } from "react";
import { BoardContext } from "./BoardContext";
import type { createBoardStore } from "./createBoardStore";

export namespace BoardProvider {
	export interface Props extends PropsWithChildren {
		store: createBoardStore.Hook;
	}
}

export const BoardProvider: FC<BoardProvider.Props> = ({ children, store }) => {
	return <BoardContext.Provider value={store}>{children}</BoardContext.Provider>;
};
