import { Data } from "effect";

export class InfraError extends Data.TaggedError("InfraError")<{
	type: string;
	message?: string;
}> {
	//
}
