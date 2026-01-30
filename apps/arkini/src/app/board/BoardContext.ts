import { createContext } from "react";
import { createBoardStore } from "./createBoardStore";

export const BoardContext = createContext<createBoardStore.Hook>(
	createBoardStore({
		items: [],
	}),
);
