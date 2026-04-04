import { Either } from "effect";
import { expect } from "vitest";

export const expectErrorFx = <L, R>(result: Either.Either<L, R>) => {
	expect(Either.isLeft(result)).toBe(true);

	if (Either.isRight(result)) {
		throw new Error("Expected Effect.either(...) to return Left");
	}

	return result.left;
};
