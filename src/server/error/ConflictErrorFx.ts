import { Data } from "effect";

export class ConflictErrorFx extends Data.TaggedError("ConflictErrorFx")<{
	/**
	 * What to say - you see? This is a message.
	 */
	message: string;
	/**
	 * The original error that caused the conflict.
	 */
	cause?: unknown;
}> {
	toJSON() {
		return {
			message: this.message,
			name: this.name,
			tag: this._tag,
			cause: this.cause,
		};
	}
}
