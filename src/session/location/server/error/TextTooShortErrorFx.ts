import { Data } from "effect";
import type { WireError } from "@/lib/common/error";

export class TextTooShortErrorFx
	extends Data.TaggedError("TextTooShortErrorFx")<{
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
