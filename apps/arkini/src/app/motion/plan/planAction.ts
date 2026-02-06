import type { Action } from "~/app/motion/Action";
import type { Plan } from "~/app/motion/Plan";

export const planAction = (action: Action): Plan => {
	return {
		type: "action",
		action,
	};
};
