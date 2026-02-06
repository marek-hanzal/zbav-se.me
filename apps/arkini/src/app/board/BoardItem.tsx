import type { tBoardItem } from "@zbav-se.me/sdk/api/arkini";
import type { AnimationPlaybackControlsWithThen } from "motion/react";
import { motion } from "motion/react";
import type { FC, RefObject } from "react";
import { useRef } from "react";
import { useBoardStore } from "~/app/board/useBoardStore";
import type { Action } from "~/app/motion/Action";
import { createRenderNode } from "~/app/motion/createRenderNode";
import { intent } from "~/app/motion/engine/intent";
import type { Layout } from "~/app/motion/Layout";
import type { Motion } from "~/app/motion/Motion";

export namespace BoardItem {
	export interface Props {
		boardRef: RefObject<HTMLDivElement | null>;
		item: tBoardItem;
		layout: Layout;
	}
}

export const BoardItem: FC<BoardItem.Props> = ({ boardRef, item, layout }) => {
	const patch = useBoardStore((s) => s.patch);

	const nodeRef = useRef<Motion.RenderNode | null>(null);
	const activeLayoutRef = useRef<Motion.Layout | null>(null);
	const animsByIdRef = useRef<Map<string, Set<AnimationPlaybackControlsWithThen>>>(new Map());
	const nodesByIdRef = useRef<Map<string, Motion.RenderNode>>(new Map());
	const itemsRef = useRef<tBoardItem[]>([
		item,
	]);
	const animationsEnabledRef = useRef(true);

	// keep fresh
	itemsRef.current = [
		item,
	];

	if (!nodeRef.current) {
		const node = createRenderNode({
			id: item.id,
			cell: {
				x: item.x,
				y: item.y,
			},
			layout,
			boardRef,
		});

		// normalize na offset model (x/y jsou drag offsety)
		node.motionValues.x.set(0);
		node.motionValues.y.set(0);

		nodeRef.current = node;
	}

	// expose node pro intent (lokálně, jen tento item)
	nodesByIdRef.current.set(item.id, nodeRef.current);

	const refs: intent.Refs = {
		boardRef,
		activeLayoutRef,
		animsByIdRef,
		nodesByIdRef,
		itemsRef,
	};

	const deps: intent.Deps = {
		layout,
		animationsEnabledRef,
		patch,
	};

	const node = nodeRef.current;
	const base = layout.cellToPx({
		x: item.x,
		y: item.y,
	});

	const { id, motionValues: _, style, className, ...rest } = node;

	const send = (action: Action) => {
		intent({
			action,
			refs,
			deps,
		});
	};

	return (
		<motion.div
			{...rest}
			drag
			dragConstraints={boardRef}
			dragMomentum={false}
			dragElastic={0}
			className={[
				"pointer-events-auto select-none",
				"cursor-grab active:cursor-grabbing",
				typeof className === "string" ? className : "",
			]
				.filter(Boolean)
				.join(" ")}
			style={{
				...style,

				// base pozice (cell) + velikost (layout)
				left: base.x,
				top: base.y,
				width: layout.cellSize.width,
				height: layout.cellSize.height,

				position: "absolute",
				touchAction: "none",
			}}
			onDragStart={() => {
				send({
					type: "drag-start",
					id,
				});
			}}
			onDragEnd={(_, info) => {
				send({
					type: "drag-end",
					id,
					target: info.point,
				});
			}}
		>
			<div className="h-full w-full p-1">
				<div className="h-full w-full rounded-xl bg-white/10 ring-1 ring-white/15 flex items-center justify-center text-white/80 text-sm">
					{item.x},{item.y} [{item.level}]
				</div>
			</div>
		</motion.div>
	);
};
