import { Layer } from "effect";
import { type RoutesContext, RoutesContextFx } from "~/route/context/RoutesContextFx";

export const RoutesContextLayer = (context: RoutesContext) => {
	return Layer.succeed(RoutesContextFx, context);
};
