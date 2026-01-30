import { useContext } from "react";
import { BoardContext } from "./BoardContext";

export const useBoardContext = () => {
	return useContext(BoardContext);
};
