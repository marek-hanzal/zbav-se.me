import { motion } from "motion/react";
import type { FC } from "react";
import type { Motion } from "~/app/motion/Motion";

export namespace BoardItem {
	export interface Props {
		renderNode: Motion.RenderNode;
	}
}

export const BoardItem: FC<BoardItem.Props> = ({ renderNode }) => {
	const { id, motionValues, style, ...props } = renderNode;

	return (
		<motion.div
			{...props}
			style={{
				...style,
				...motionValues,
				position: "absolute",
				touchAction: "none",
			}}
		>
			<div className="h-full w-full p-1">
				<div className="h-full w-full rounded-xl bg-white/10 ring-1 ring-white/15 flex items-center justify-center text-white/80 text-sm">
					{id}
				</div>
			</div>
		</motion.div>
	);
};
