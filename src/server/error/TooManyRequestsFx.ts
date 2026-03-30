import { Data } from "effect";

export class TooManyRequestsFx extends Data.TaggedError("TooManyRequestsFx")<{
	message: string;
}> {
	//
}
