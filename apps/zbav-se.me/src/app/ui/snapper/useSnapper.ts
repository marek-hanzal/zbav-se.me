import { useContext } from "react";
import { SnapperCtx } from "./SnapperCtx";

export const useSnapper = () => {
	const ctx = useContext(SnapperCtx);
	if (!ctx) {
		throw new Error("Snapper* must be inside <Snapper/>");
	}
	const { orientation, containerRef } = ctx;

	const scrollToIndex = (
		index: number,
		behavior: ScrollBehavior = "smooth",
	) => {
		const el = containerRef.current;
		if (!el) return;

		if (orientation === "vertical") {
			const size = el.clientHeight;
			el.scrollTo({
				top: index * size,
				behavior,
			});
		} else {
			const size = el.clientWidth;
			el.scrollTo({
				left: index * size,
				behavior,
			});
		}
	};

	return {
		...ctx,
		scrollToIndex,
	};
};
