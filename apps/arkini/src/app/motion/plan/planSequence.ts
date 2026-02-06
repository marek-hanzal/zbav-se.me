import type { Plan } from "~/app/motion/Plan";

export const planSequence = (children: Plan[]): Plan => {
	return {
		type: "sequence",
		children,
	};
};
