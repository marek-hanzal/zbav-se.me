import { Layer } from "effect";
import { type RoutesContext, RoutesContextFx } from "~/routes/context/RoutesContextFx";

export const RoutesContextLayer = (context: RoutesContext) => {
	return Layer.succeed(RoutesContextFx, context);
};
