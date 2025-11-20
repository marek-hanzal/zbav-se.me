import { Data } from "effect";

export class NoContentError extends Data.TaggedError("NoContentError")<{
	resource: string;
	message: string;
}> {
	//
}
