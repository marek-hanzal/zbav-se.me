import { Effect } from "effect";
import { describe, it } from "vitest";
import { userEventSellerInfoFx } from "~/@user/user-event/fx/userEventSellerInfoFx";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import { testabase } from "../../../../testabase";

describe("userEventSellerInfoFx", () => {
	it("runs the effect", async () => {
		const database = await testabase();

		const kysely = await database.kysely();

		const result = await Effect.runPromise(
			userEventSellerInfoFx({
				userId: "test-user-id",
			}).pipe(DatabaseContextProvider(kysely)),
		);

		console.log(result);
	});
});
