import { Effect } from "effect";
import { describe, it } from "vitest";
import { userEventSellerInfoFx } from "~/@user/user-event/fx/userEventSellerInfoFx";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";

describe("userEventSellerInfoFx", () => {
	it("runs the effect", async () => {
		const result = await Effect.runPromise(
			userEventSellerInfoFx({
				userId: "test-user-id",
			}).pipe(DatabaseContextProvider()),
		);
	});
});
