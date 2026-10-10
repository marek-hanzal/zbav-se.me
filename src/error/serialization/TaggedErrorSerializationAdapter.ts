import { createSerializationAdapter } from "@tanstack/react-router";
import { Predicate } from "effect";
import { TaggedError } from "~/error/error/TaggedError";

export namespace TaggedErrorSerializationAdapter {
	export interface TaggedError extends Error {
		readonly _tag: string;
	}

	export type Input = TaggedError;

	export interface Wire {
		message: string;
		tag: string;
	}
}

const isTaggedErrorFn = (value: unknown): value is TaggedErrorSerializationAdapter.TaggedError => {
	return (
		Predicate.isError(value) &&
		Predicate.hasProperty(value, "_tag") &&
		typeof value._tag === "string"
	);
};

export const toTaggedErrorFn = (
	value: unknown,
): TaggedErrorSerializationAdapter.TaggedError | undefined => {
	return isTaggedErrorFn(value) ? value : undefined;
};

export const TaggedErrorSerializationAdapter = createSerializationAdapter<
	TaggedErrorSerializationAdapter.Input,
	TaggedErrorSerializationAdapter.Wire
>({
	key: "TaggedError",
	test(value): value is TaggedErrorSerializationAdapter.Input {
		return !!toTaggedErrorFn(value);
	},
	toSerializable(value) {
		const error = toTaggedErrorFn(value);

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
