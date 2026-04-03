import { Effect } from "effect";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import type { testabase } from "../testabase";

export type TestDatabase = Awaited<ReturnType<typeof testabase>>;

export async function getUserIdByEmail(database: TestDatabase, email: string) {
	return Effect.gen(function* () {
		const user = yield* Effect.promise(() =>
			database.kysely
				.selectFrom("user")
				.select([
					"id",
				])
				.where("email", "=", email)
				.executeTakeFirstOrThrow(),
		);

		return user.id;
	}).pipe(withRuntimeFx(database), Effect.runPromise);
}

export async function waitForRow<T>(
	database: TestDatabase,
	selectRow: () => Promise<T | undefined>,
	errorMessage: string,
) {
	return Effect.gen(function* () {
		for (let index = 0; index < 20; index += 1) {
			const row = yield* Effect.promise(selectRow);

			if (row) {
				return row;
			}

			yield* Effect.promise(() => new Promise((resolve) => setTimeout(resolve, 250)));
		}

		throw new Error(errorMessage);
	}).pipe(withRuntimeFx(database), Effect.runPromise);
}
