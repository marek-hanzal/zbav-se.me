import { Data } from "effect";
import type { WireError } from "~/error/type/WireError";

export class TooManyRequestsFx
	extends Data.TaggedError("TooManyRequestsFx")<{
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
