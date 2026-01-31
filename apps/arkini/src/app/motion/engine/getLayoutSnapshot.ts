import { createLayout } from "~/app/motion/engine/createLayout";
import type { Layout } from "~/app/motion/Layout";
import type { Motion } from "~/app/motion/Motion";

export namespace getLayoutSnapshot {
	export interface Props {
		boardRef: React.RefObject<HTMLDivElement | null>;
		layout: Layout;
	}
}

export const getLayoutSnapshot = ({
	boardRef,
	layout,
}: getLayoutSnapshot.Props): Motion.Layout | null => {
	const el = boardRef.current;
	if (!el) {
		return null;
	}

	return createLayout({
		rect: el.getBoundingClientRect(),
		width: layout.width,
		height: layout.height,
	});
};
