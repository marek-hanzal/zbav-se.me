import { Data } from "effect";
import type { WireError } from "@/lib/common/error";

/**
 * General runtime error not belonging to a particular domain.
 */
export class RuntimeErrorFx
	extends Data.TaggedError("RuntimeErrorFx")<{
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
