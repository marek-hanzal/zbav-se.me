import type { MotionValue } from "motion/react";

export type RenderMotionValue = Record<"x" | "y" | "opacity" | "scale", MotionValue<number>>;
