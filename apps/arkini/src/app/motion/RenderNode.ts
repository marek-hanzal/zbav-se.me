import type { HTMLMotionProps } from "motion/react";
import type { RenderMotionValue } from "~/app/motion/RenderMotionValue";

export interface RenderNode extends Omit<HTMLMotionProps<"div">, "children"> {
	id: string;
	motionValues: RenderMotionValue;
}
