import { Data } from "effect";

export class NotFoundErrorFx extends Data.TaggedError("NotFoundErrorFx")<{
	resource: string;
	resourceId?: string;
	message: string;
}> {
	toJSON() {
		return {
			message: this.message,
			name: this.name,
			tag: this._tag,
			resource: this.resource,
			resourceId: this.resourceId,
		};
	}
}
