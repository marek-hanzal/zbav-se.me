import type { Plan } from "~/app/motion/Plan";

export const planParalel = (children: Plan[]): Plan => {
	return {
		type: "paralel",
		children,
	};
};
