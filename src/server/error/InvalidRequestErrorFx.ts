import { Data } from "effect";

export class InvalidRequestErrorFx extends Data.TaggedError("InvalidRequestErrorFx")<{
	message: string;
}> {
	//
}
