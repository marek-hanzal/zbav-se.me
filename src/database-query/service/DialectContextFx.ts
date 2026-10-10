import { Context } from "effect";
import type { Dialect } from "kysely";

export class DialectContextFx extends Context.Service<DialectContextFx, Dialect>()(
	"DialectContextFx",
) {
	//
}
