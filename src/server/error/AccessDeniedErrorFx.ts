import { Data } from "effect";

export class AccessDeniedErrorFx extends Data.TaggedError("AccessDeniedErrorFx")<{
	message: string;
}> {
	//
}
