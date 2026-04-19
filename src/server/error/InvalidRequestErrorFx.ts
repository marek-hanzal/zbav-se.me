import { Data } from "effect";
import type { WireError } from "@/lib/common/error";

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
