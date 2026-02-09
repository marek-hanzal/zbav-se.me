import { Data } from "effect";

export class ConflictErrorFx extends Data.TaggedError("ConflictErrorFx")<{
	message: string;
}> {
	//
}
