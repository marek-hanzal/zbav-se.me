import { Context } from "effect";
import type { Dialect } from "kysely";

export class DialectContextFx extends Context.Tag("DialectContextFx")<DialectContextFx, Dialect>() {
	//
}
