import { Result } from "effect";
import { expect } from "vitest";

export const expectErrorFx = <A, E>(result: Result.Result<A, E>) => {
	expect(Result.isFailure(result)).toBe(true);

	if (Result.isSuccess(result)) {
		throw new Error("Expected Effect.result(...) to return Failure");
	}

	return result.failure;
};
