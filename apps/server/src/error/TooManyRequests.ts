import { Data } from "effect";

export class TooManyRequests extends Data.TaggedError("TooManyRequests")<{
	message: string;
}> {
	//
}
