import { Data } from "effect";

export class InvalidRequestErrorFx extends Data.TaggedError("InvalidRequestErrorFx")<{
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
