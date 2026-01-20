import { Layer } from "effect";
import { type DialectContext, DialectContextFx } from "./DialectContextFx";

export const DialectContextLayer = (dialect: DialectContext) => {
	return Layer.succeed(DialectContextFx, dialect);
};
