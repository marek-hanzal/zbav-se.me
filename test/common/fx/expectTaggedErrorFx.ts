import type { Either } from "effect";
import { expect } from "vitest";
import { expectErrorFx } from "~/test/common/fx/expectErrorFx";

export namespace expectTaggedErrorFx {
	export interface Props {
		tag: string;
		message?: string;
		messageIncludes?: string;
	}
}

export const expectTaggedErrorFx = <L, R>(
	result: Either.Either<L, R>,
	{ tag, message, messageIncludes }: expectTaggedErrorFx.Props,
) => {
	const error = expectErrorFx(result) as {
		_tag?: string;
		message?: string;
	};

	expect(error._tag).toBe(tag);

	if (message !== undefined) {
		expect(error.message).toBe(message);
	}

	if (messageIncludes !== undefined) {
		expect(error.message).toContain(messageIncludes);
	}

	return error;
};
