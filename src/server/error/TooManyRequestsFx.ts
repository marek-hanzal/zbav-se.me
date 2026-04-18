import { Data } from "effect";

export class TooManyRequestsFx extends Data.TaggedError("TooManyRequestsFx")<{
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
