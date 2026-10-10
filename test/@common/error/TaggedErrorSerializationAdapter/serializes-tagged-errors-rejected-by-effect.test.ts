import { Effect } from "effect";
import { describe, expect, test } from "vitest";
import {
	TaggedErrorSerializationAdapter,
	toTaggedError,
} from "~/error/serialization/TaggedErrorSerializationAdapter";
import { RateLimitErrorFx } from "~/server/error/RateLimitErrorFx";

const rateLimitError = new RateLimitErrorFx({
	message: "Too many magic link requests. Please try again later.",
	rule: "auth:magic-link",
	limit: 3,
	count: 4,
	exceeded: 1,
	window: 900,
	retryAt: "2026-05-21T10:00:00.000Z",
});

const runRejectedError = async () => {
	try {
		await Effect.fail(rateLimitError).pipe(Effect.runPromise);
	} catch (error) {
		return error;
	}

	throw new Error("Expected Effect.runPromise to reject");
};

describe("TaggedErrorSerializationAdapter", () => {
	test("serializes tagged errors rejected by Effect.runPromise", async () => {
		const rejectedError = await runRejectedError();

		expect(rejectedError).toBe(rateLimitError);
		expect(toTaggedError(rejectedError)).toBe(rateLimitError);
		expect(TaggedErrorSerializationAdapter.test(rejectedError)).toBe(true);
		if (!TaggedErrorSerializationAdapter.test(rejectedError)) {
			throw new Error("Expected the rejected tagged error to be serializable");
		}
		expect(TaggedErrorSerializationAdapter.toSerializable(rejectedError)).toEqual({
			message: "Too many magic link requests. Please try again later.",
			tag: "RateLimitErrorFx",
		});
	});
});
