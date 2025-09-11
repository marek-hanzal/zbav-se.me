import { useContext } from "react";
import { SnapperCtx } from "./SnapperCtx";

export const useSnapper = () => {
	const snapper = useContext(SnapperCtx);
	if (!snapper) {
		throw new Error("Snapper* must be inside <Snapper/>");
	}
	return snapper;
};
