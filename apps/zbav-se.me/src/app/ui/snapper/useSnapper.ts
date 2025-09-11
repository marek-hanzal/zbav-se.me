import { useContext } from "react";
import { SnapperCtx } from "./SnapperCtx";

export const useSnapper = () => {
	const ctx = useContext(SnapperCtx);
	if (!ctx) {
		throw new Error("Snapper* must be inside <Snapper/>");
	}

	return ctx;
};
