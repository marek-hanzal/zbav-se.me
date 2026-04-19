import { Data } from "effect";
import type z from "zod";
import type { WireError } from "./WireError";

export class ZodErrorFx<TSchema extends z.ZodSchema>
	extends Data.TaggedError("ZodErrorFx")<{
		zod: z.ZodError<z.infer<TSchema>>;
		input: unknown;
	}>
	implements WireError
{
	toJSON() {
		return {
			message: this.message,
			name: this.name,
			tag: this._tag,
			input: this.input,
			zod: this.zod,
		};
	}
}
