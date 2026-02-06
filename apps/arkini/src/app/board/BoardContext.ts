import { createContext } from "react";
import type { createBoardStore } from "./createBoardStore";

export const BoardContext = createContext<createBoardStore.Hook | null>(null);
