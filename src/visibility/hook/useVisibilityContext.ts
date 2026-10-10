import { useContext } from "react";
import { VisibilityContext } from "~/visibility/context/VisibilityContext";

export const useVisibilityContext = () => {
	return useContext(VisibilityContext);
};
