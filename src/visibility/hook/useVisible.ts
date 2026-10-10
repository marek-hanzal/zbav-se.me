import { useContext } from "react";
import { VisibilityContext } from "~/visibility/context/VisibilityContext";

export const useVisible = () => {
	const contextFn = useContext(VisibilityContext);
	if (!contextFn) {
		throw new Error("useVisible must be used within a VisibilityProvider");
	}
	return contextFn;
};
