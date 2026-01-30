import { useContext } from "react";
import { useStore } from "zustand/react";
import type { ExtractState } from "zustand/vanilla";
import { BoardContext } from "~/app/board/BoardContext";
import type { createBoardStore } from "./createBoardStore";

export const useBoardStore = <T>(
	selector: (state: ExtractState<createBoardStore.Hook>) => T,
): T => {
	const context = useContext(BoardContext);
	if (!context) {
		throw new Error("useBoardStore must be used within a BoardProvider");
	}
	return useStore(context, selector);
};
