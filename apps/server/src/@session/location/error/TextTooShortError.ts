import { Data } from "effect";

export class TextTooShortError extends Data.TaggedError("TextTooShortError")<{
	message: string;
}> {
	//
}
