import { createSerializationAdapter } from "@tanstack/react-router";
import { Cause, Option, Predicate, Runtime } from "effect";
import { TaggedError } from "./TaggedError";

export namespace TaggedErrorSerializationAdapter {
	export interface TaggedError extends Error {
		readonly _tag: string;
	}

	export type Input = Runtime.FiberFailure | TaggedError;

	export interface Wire {
		message: string;
		tag: string;
	}
}

const isTaggedError = (value: unknown): value is TaggedErrorSerializationAdapter.TaggedError => {
	return (
		Predicate.isError(value) &&
		Predicate.hasProperty(value, "_tag") &&
		typeof value._tag === "string"
	);
};

export const toTaggedError = (
	value: unknown,
): TaggedErrorSerializationAdapter.TaggedError | undefined => {
	if (isTaggedError(value)) {
		return value;
	}

	if (!Runtime.isFiberFailure(value)) {
		return undefined;
	}

	const failure = Cause.failureOption(value[Runtime.FiberFailureCauseId]);

	if (Option.isSome(failure) && isTaggedError(failure.value)) {
		return failure.value;
	}
};

export const TaggedErrorSerializationAdapter = createSerializationAdapter<
	TaggedErrorSerializationAdapter.Input,
	TaggedErrorSerializationAdapter.Wire
>({
	key: "TaggedError",
	test(value): value is TaggedErrorSerializationAdapter.Input {
		return !!toTaggedError(value);
	},
	toSerializable(value) {
		const error = toTaggedError(value);

		if (!error) {
			throw new Error("TaggedErrorSerializationAdapter received untagged error");
		}

		return {
			message: error.message,
			tag: error._tag,
		};
	},
	fromSerializable(value) {
		return new TaggedError(value);
	},
});
