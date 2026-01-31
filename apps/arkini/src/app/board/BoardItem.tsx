import { clamp } from "@use-pico/common/clamp";
import type { tBoardItem } from "@zbav-se.me/sdk/api/arkini";
import { animate, motion, useMotionValue } from "motion/react";
import type { FC, RefObject } from "react";
import { useRef } from "react";
import { useBoardStore } from "~/app/board/useBoardStore";

export namespace BoardItem {
	export interface Props {
		boardRef: RefObject<HTMLDivElement | null>;
		item: tBoardItem;
		cols: number;
		rows: number;
	}
}

export const BoardItem: FC<BoardItem.Props> = ({ boardRef, item, cols, rows }) => {
	const patch = useBoardStore((state) => state.patch);

	const dx = useMotionValue(0);
	const dy = useMotionValue(0);

	const snapTokenRef = useRef(0);
	const animXRef = useRef<ReturnType<typeof animate> | null>(null);
	const animYRef = useRef<ReturnType<typeof animate> | null>(null);

	const stopSnap = () => {
		animXRef.current?.stop?.();
		animYRef.current?.stop?.();
		animXRef.current = null;
		animYRef.current = null;
	};

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
			].join(" ")}
			whileDrag={{
				scale: 1.25,
			}}
			onDragStart={() => {
				snapTokenRef.current += 1;
				stopSnap();
			}}
			onDragEnd={(_, info) => {
				const boardEl = boardRef.current;
				if (!boardEl) {
					return;
				}

				stopSnap();
				const token = ++snapTokenRef.current;

				const boardRect = boardEl.getBoundingClientRect();
				const cellW = boardRect.width / cols;
				const cellH = boardRect.height / rows;

				const localX = info.point.x - boardRect.left;
				const localY = info.point.y - boardRect.top;

				const nextX = clamp(Math.floor(localX / cellW), 0, cols - 1);
				const nextY = clamp(Math.floor(localY / cellH), 0, rows - 1);

				if (nextX === item.x && nextY === item.y) {
					animXRef.current = animate(dx, 0, {
						type: "spring",
						stiffness: 600,
						damping: 40,
					});
					animYRef.current = animate(dy, 0, {
						type: "spring",
						stiffness: 600,
						damping: 40,
					});
					return;
				}

				const targetDx = (nextX - item.x) * cellW;
				const targetDy = (nextY - item.y) * cellH;

				const ax = animate(dx, targetDx, {
					type: "spring",
					stiffness: 700,
					damping: 45,
				});
				const ay = animate(dy, targetDy, {
					type: "spring",
					stiffness: 700,
					damping: 45,
				});

				animXRef.current = ax;
				animYRef.current = ay;

				Promise.all([
					ax.finished,
					ay.finished,
				]).then(() => {
					if (snapTokenRef.current !== token) {
						return;
					}

					dx.set(0);
					dy.set(0);

					patch(item.id, {
						x: nextX,
						y: nextY,
					});
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
