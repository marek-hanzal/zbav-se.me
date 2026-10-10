import type { Result } from "effect";
import { expect } from "vitest";
import { expectErrorFn } from "~/test/common/fx/expectErrorFn";

export namespace expectTaggedErrorFn {
	export interface Props {
		tag: string;
		message?: string;
		messageIncludes?: string;
	}
}

export const expectTaggedErrorFn = <A, E>(
	result: Result.Result<A, E>,
	{ tag, message, messageIncludes }: expectTaggedErrorFn.Props,
) => {
	const error = expectErrorFn(result);

	expect(error).toHaveProperty("_tag", tag);

	if (message !== undefined) {
		expect(error).toHaveProperty("message", message);
	}

	if (messageIncludes !== undefined) {
		expect(error).toHaveProperty("message", expect.stringContaining(messageIncludes));
	}

	return error;
};
