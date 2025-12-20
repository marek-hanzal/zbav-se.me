import { useContext } from "react";
import { VisibilityContext } from "../context/VisibilityContext";

export const useVisible = () => {
	return useContext(VisibilityContext);
};
