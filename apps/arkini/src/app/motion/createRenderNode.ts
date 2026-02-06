import { motionValue } from "motion/react";
import type { RefObject } from "react";
import type { Cell } from "~/app/motion/Cell";
import type { Layout } from "~/app/motion/Layout";
import type { RenderMotionValue } from "~/app/motion/RenderMotionValue";
import type { RenderNode } from "~/app/motion/RenderNode";

export namespace createRenderNode {
	export interface Props {
		id: string;
		cell: Cell;
		layout: Layout;
		boardRef: RefObject<HTMLDivElement | null>;
	}
}

export function createRenderNode({
	id,
	cell,
	layout,
	boardRef,
}: createRenderNode.Props): RenderNode {
	const position = layout.cellToPx(cell);

	const motionValues: RenderMotionValue = {
		x: motionValue(0),
		y: motionValue(0),
		opacity: motionValue(1),
		scale: motionValue(1),
	};

	return {
		id,
		motionValues,
		//
		drag: true,
		dragConstraints: boardRef,
		dragMomentum: false,
		dragElastic: 0,
		//
		style: {
			position: "absolute",
			width: layout.cellSize.width,
			height: layout.cellSize.height,
			userSelect: "none",
			zIndex: 1,
			touchAction: "none",
			//
			left: position.x,
			top: position.y,
			//
			...motionValues,
		},
	};
}
