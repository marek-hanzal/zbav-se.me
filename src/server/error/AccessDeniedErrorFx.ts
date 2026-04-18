import { Data } from "effect";

export class AccessDeniedErrorFx extends Data.TaggedError("AccessDeniedErrorFx")<{
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
