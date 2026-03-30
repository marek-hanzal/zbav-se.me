import { Data } from "effect";

export class NotFoundErrorFx extends Data.TaggedError("NotFoundErrorFx")<{
	resource: string;
	resourceId?: string;
	message: string;
}> {
	//
}
