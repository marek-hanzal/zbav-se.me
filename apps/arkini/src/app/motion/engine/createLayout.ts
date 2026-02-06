import { clamp } from "@use-pico/common/clamp";
import type { Layout } from "~/app/motion/Layout";

export namespace createLayout {
	export interface Props {
		rect: DOMRect;
		width: number;
		height: number;
	}
}

export function createLayout({ rect, width, height }: createLayout.Props): Layout {
	const cellW = rect.width / width;
	const cellH = rect.height / height;

	return {
		width,
		height,
		cellSize: {
			width: cellW,
			height: cellH,
		},
		pxToCell({ x, y }) {
			const localX = x - rect.left;
			const localY = y - rect.top;
			return {
				x: clamp(Math.floor(localX / cellW), 0, width - 1),
				y: clamp(Math.floor(localY / cellH), 0, height - 1),
			};
		},
		cellToPx: (cell) => ({
			x: cell.x * cellW,
			y: cell.y * cellH,
		}),
		deltaPx: (from, to) => ({
			x: (to.x - from.x) * cellW,
			y: (to.y - from.y) * cellH,
		}),
	};
}
