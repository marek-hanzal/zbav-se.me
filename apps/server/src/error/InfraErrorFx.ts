import { Data } from "effect";

export class InfraErrorFx extends Data.TaggedError("InfraErrorFx")<{
	type: string;
	message?: string;
}> {
	//
}
