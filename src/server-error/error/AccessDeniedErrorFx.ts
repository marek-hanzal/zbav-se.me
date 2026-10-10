import { Data } from "effect";
import type { WireError } from "~/error/type/WireError";

export class AccessDeniedErrorFx
	extends Data.TaggedError("AccessDeniedErrorFx")<{
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
