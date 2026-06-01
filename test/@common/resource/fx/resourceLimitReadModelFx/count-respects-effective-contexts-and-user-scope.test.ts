import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { resourceLimitCountFx } from "~/common/resource/server/fx/resourceLimitCountFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import {
	atResourceLimitReadModelFx,
	seedResourceLimitReadModelFx,
} from "./resourceLimitReadModelFixture";

describe("resourceLimit read model fx", () => {
	it("count respects effective bundle limits and user scope", async () => {
		const database = await testabase("resource-limit-count");

		return Effect.gen(function* () {
			const { seller, buyer } = yield* seedResourceLimitReadModelFx(database);

			const sellerCount = yield* atResourceLimitReadModelFx(
				"2026-05-12T10:00:00.000Z",
				resourceLimitCountFx({
					scope: {
						userId: seller.id,
					},
				}),
			);
			const buyerCount = yield* atResourceLimitReadModelFx(
				"2026-05-12T10:00:00.000Z",
				resourceLimitCountFx({
					scope: {
						userId: buyer.id,
					},
				}),
			);

			expect(sellerCount).toBe(4);
			expect(buyerCount).toBe(2);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
