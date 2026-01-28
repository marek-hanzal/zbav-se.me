import { Layer } from "effect";
import { type RoutesContext, RoutesContextFx } from "~/@common/route/context/RoutesContextFx";

export const RoutesContextLayer = (context: RoutesContext) => {
	return Layer.succeed(RoutesContextFx, context);
};
