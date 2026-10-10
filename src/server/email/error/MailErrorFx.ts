import { Data } from "effect";
import type { WireError } from "~/error/type/WireError";

export class MailErrorFx
	extends Data.TaggedError("MailErrorFx")<{
		message: string;
		cause?: unknown;
	}>
	implements WireError
{
	toJSON() {
		return {
			message: this.message,
			name: this.name,
			tag: this._tag,
			cause: this.cause,
		};
	}
}
