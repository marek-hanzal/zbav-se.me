import { Data } from "effect";
import type { WireError } from "~/error/type/WireError";

export class InvalidRequestErrorFx
	extends Data.TaggedError("InvalidRequestErrorFx")<{
		message: string;
	}>
	implements WireError
{
	toJSON() {
		return {
			message: this.message,
			name: this.name,
			tag: this._tag,
		};
	}
}
