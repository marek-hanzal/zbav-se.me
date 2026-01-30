import { clamp } from "@use-pico/common/clamp";
import type { tBoardItem } from "@zbav-se.me/sdk/api/arkini";
import { withBoardItemPatchMutation } from "@zbav-se.me/sdk/mutation/arkini/board-item";
import { withBoardItemFetchQuery } from "@zbav-se.me/sdk/query/arkini";
import { motion, useMotionValue } from "motion/react";
import type { FC, RefObject } from "react";

export namespace BoardItem {
	export interface Props {
		boardRef: RefObject<HTMLDivElement | null>;
		item: tBoardItem;
		cols: number;
		rows: number;
	}
}

export const BoardItem: FC<BoardItem.Props> = ({ boardRef, item, cols, rows }) => {
	const boardItemPatch = withBoardItemFetchQuery.useSet();
	const boardItemPatchMutation = withBoardItemPatchMutation.useMutation({
		onSuccess(boardItem) {
			boardItemPatch(
				(prev) => ({
					...prev,
					...boardItem,
				}),
				{
					where: {
						id: item.id,
					},
				},
			);
		},
	});

	const dx = useMotionValue(0);
	const dy = useMotionValue(0);

	return (
		<motion.div
			drag
			dragConstraints={boardRef}
			dragMomentum={false}
			dragElastic={0}
			style={{
				width: `calc(100% / ${cols})`,
				height: `calc(100% / ${rows})`,
				left: `calc((100% / ${cols}) * ${item.x})`,
				top: `calc((100% / ${rows}) * ${item.y})`,
				position: "absolute",
				touchAction: "none",
				x: dx,
				y: dy,
			}}
			className={[
				"pointer-events-auto select-none",
				"cursor-grab active:cursor-grabbing",
				item.commit ? "opacity-100" : "opacity-50",
			].join(" ")}
			whileDrag={{
				scale: 1.25,
			}}
			onDragEnd={(_, info) => {
				const boardEl = boardRef.current;
				if (!boardEl) {
					return;
				}

				const boardRect = boardEl.getBoundingClientRect();
				const cellW = boardRect.width / cols;
				const cellH = boardRect.height / rows;

				const localX = info.point.x - boardRect.left;
				const localY = info.point.y - boardRect.top;

				const nextX = clamp(Math.floor(localX / cellW), 0, cols - 1);
				const nextY = clamp(Math.floor(localY / cellH), 0, rows - 1);

				dx.set(0);
				dy.set(0);

				if (nextX === item.x && nextY === item.y) {
					return;
				}

				boardItemPatch(
					(prev) =>
						prev
							? {
									...prev,
									x: nextX,
									y: nextY,
									commit: false,
								}
							: prev,
					{
						where: {
							id: item.id,
						},
					},
				);

				boardItemPatchMutation.mutate({
					patch: {
						x: nextX,
						y: nextY,
					},
					query: {
						where: {
							id: item.id,
						},
					},
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
