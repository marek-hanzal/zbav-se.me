import { Data } from "effect";

export class NoContentErrorFx extends Data.TaggedError("NoContentErrorFx")<{
	resource: string;
	message: string;
}> {
	//
}
