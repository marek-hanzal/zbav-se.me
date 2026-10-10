import { useContext } from "react";
import { VisibilityContext } from "~/visibility/context/VisibilityContext";

export const useVisible = () => {
	const context = useContext(VisibilityContext);
	if (!context) {
		throw new Error("useVisible must be used within a VisibilityProvider");
	}
	return context;
};
