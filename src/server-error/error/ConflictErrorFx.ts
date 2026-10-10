import { Data } from "effect";
import type { WireError } from "~/error/type/WireError";

export class ConflictErrorFx
	extends Data.TaggedError("ConflictErrorFx")<{
		/**
		 * What to say - you see? This is a message.
		 */
		message: string;
		/**
		 * The original error that caused the conflict.
		 */
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
