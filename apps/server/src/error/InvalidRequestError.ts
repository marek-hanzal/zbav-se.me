import { Data } from "effect";

export class InvalidRequestError extends Data.TaggedError(
	"InvalidRequestError",
)<{
	message: string;
}> {
	//
}
