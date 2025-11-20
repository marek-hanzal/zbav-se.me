import { Data } from "effect";

export class AccessDeniedError extends Data.TaggedError("AccessDeniedError")<{
	message: string;
}> {
	//
}
