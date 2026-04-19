import { Data } from "effect";
import type { WireError } from "./WireError";

export class NotFoundErrorFx
	extends Data.TaggedError("NotFoundErrorFx")<{
		resource: string;
		resourceId?: string;
		message: string;
	}>
	implements WireError
{
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
