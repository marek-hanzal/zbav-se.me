import { Data } from "effect";

export class TextTooShortErrorFx extends Data.TaggedError("TextTooShortErrorFx")<{
	message: string;
}> {
	//
}
