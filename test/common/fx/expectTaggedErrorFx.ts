import type { Result } from "effect";
import { expect } from "vitest";
import { expectErrorFx } from "~/test/common/fx/expectErrorFx";

export namespace expectTaggedErrorFx {
	export interface Props {
		tag: string;
		message?: string;
		messageIncludes?: string;
	}
}

export const expectTaggedErrorFx = <A, E>(
	result: Result.Result<A, E>,
	{ tag, message, messageIncludes }: expectTaggedErrorFx.Props,
) => {
	const error = expectErrorFx(result);

	expect(error).toHaveProperty("_tag", tag);

	if (message !== undefined) {
		expect(error).toHaveProperty("message", message);
	}

	if (messageIncludes !== undefined) {
		expect(error).toHaveProperty("message", expect.stringContaining(messageIncludes));
	}

	return error;
};
