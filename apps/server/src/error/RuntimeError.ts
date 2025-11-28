import { Data } from "effect";

/**
 * General runtime error not belonging to a particular domain.
 */
export class RuntimeError extends Data.TaggedError("RuntimeError")<{
	message: string;
}> {
	//
}
