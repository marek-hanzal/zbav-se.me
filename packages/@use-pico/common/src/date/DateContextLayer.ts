import { Layer } from "effect";
import { type DateContext, DateContextFx } from "./DateContextFx";

export const DateContextLayer = (date: DateContext) => {
	return Layer.succeed(DateContextFx, date);
};
