import { Data } from "effect";

export class TextTooShortErrorFx extends Data.TaggedError("TextTooShortErrorFx")<{
	message: string;
}> {
	toJSON() {
		return {
			message: this.message,
			name: this.name,
			tag: this._tag,
		};
	}
}
