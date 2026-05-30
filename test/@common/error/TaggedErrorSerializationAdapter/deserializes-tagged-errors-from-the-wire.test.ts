import { Effect } from "effect";
import { describe, expect, test } from "vitest";
import { TaggedError } from "@/lib/common/error";
import {
	TaggedErrorSerializationAdapter,
	toTaggedError,
} from "@/lib/common/error/TaggedErrorSerializationAdapter";
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

const _runFiberFailure = async () => {
	try {
		await Effect.fail(rateLimitError).pipe(Effect.runPromise);
	} catch (error) {
		return error;
	}

	throw new Error("Expected Effect.runPromise to reject");
};

describe("TaggedErrorSerializationAdapter", () => {
	test("deserializes tagged errors from the wire", () => {
		const error = TaggedErrorSerializationAdapter.fromSerializable({
			message: "Too many magic link requests. Please try again later.",
			tag: "RateLimitErrorFx",
		});
		const taggedError = toTaggedError(error);

		expect(error).toBeInstanceOf(TaggedError);
		expect(taggedError?.message).toBe("Too many magic link requests. Please try again later.");
		expect(taggedError?._tag).toBe("RateLimitErrorFx");
	});
});
