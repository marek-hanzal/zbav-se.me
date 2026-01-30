import type { tBoardItem } from "@zbav-se.me/sdk/api/arkini";
import { motion } from "motion/react";
import type { FC, RefObject } from "react";

export namespace BoardItem {
	export interface Props {
		constraintsRef: RefObject<HTMLDivElement | null>;
		item: tBoardItem;
		cols: number;
		rows: number;
	}
}

export const BoardItem: FC<BoardItem.Props> = ({ constraintsRef, item, cols, rows }) => {
	return (
		<motion.div
			drag
			dragConstraints={constraintsRef}
			dragMomentum={false}
			dragElastic={0}
			style={{
				width: `calc(100% / ${cols})`,
				height: `calc(100% / ${rows})`,
				left: `calc((100% / ${cols}) * ${item.x})`,
				top: `calc((100% / ${rows}) * ${item.y})`,
				position: "absolute",
				touchAction: "none",
			}}
			className="pointer-events-auto select-none"
			whileDrag={{
				scale: 1.05,
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
