import { Data } from "effect";
import type { WireError } from "@/lib/common/error";

export class RateLimitErrorFx
	extends Data.TaggedError("RateLimitErrorFx")<{
		message: string;
		rule: string;
		limit: number;
		count: number;
		exceeded: number;
		window: number;
		retryAt: string;
	}>
	implements WireError
{
	toJSON() {
		return {
			message: this.message,
			rule: this.rule,
			limit: this.limit,
			count: this.count,
			exceeded: this.exceeded,
			window: this.window,
			retryAt: this.retryAt,
			name: this.name,
			tag: this._tag,
		};
	}
}
