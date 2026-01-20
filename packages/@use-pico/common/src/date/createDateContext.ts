import { DateTime } from "luxon";
import type { DateContext } from "./DateContextFx";

export const createDateContext = () => {
	return {
		now: () => DateTime.now(),
	} satisfies DateContext;
};
