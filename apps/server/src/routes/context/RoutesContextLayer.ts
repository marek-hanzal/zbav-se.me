import { Layer } from "effect";
import { type RoutesContext, RoutesContextFx } from "~/app/routes/RoutesContextFx";

export const RoutesContextLayer = (context: RoutesContext) => {
	return Layer.succeed(RoutesContextFx, context);
};
