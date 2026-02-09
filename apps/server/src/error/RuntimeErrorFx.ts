import { Data } from "effect";

/**
 * General runtime error not belonging to a particular domain.
 */
export class RuntimeErrorFx extends Data.TaggedError("RuntimeErrorFx")<{
	message: string;
	cause?: unknown;
}> {
	//
}
