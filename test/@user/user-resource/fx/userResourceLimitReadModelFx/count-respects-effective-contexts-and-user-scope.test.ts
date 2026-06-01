import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { userResourceLimitCountFx } from "~/user/user-resource/server/fx/userResourceLimitCountFx";
import {
	atUserResourceLimitReadModelFx,
	seedUserResourceLimitReadModelFx,
} from "./userResourceLimitReadModelFixture";

describe("userResourceLimit read model fx", () => {
	it("count respects effective bundle limits and user scope", async () => {
		const database = await testabase("user-resource-limit-count");

		return Effect.gen(function* () {
			const { seller, buyer } = yield* seedUserResourceLimitReadModelFx(database);

			const sellerCountWithoutReference = yield* atUserResourceLimitReadModelFx(
				"2026-05-12T10:00:00.000Z",
				userResourceLimitCountFx({
					scope: {
						userId: seller.id,
					},
				}),
			);
			const sellerCountForDraft = yield* atUserResourceLimitReadModelFx(
				"2026-05-12T10:00:00.000Z",
				userResourceLimitCountFx({
					scope: {
						userId: seller.id,
					},
					where: {
						reference: "draft-1",
					},
				}),
			);
			const buyerCountWithoutReference = yield* atUserResourceLimitReadModelFx(
				"2026-05-12T10:00:00.000Z",
				userResourceLimitCountFx({
					scope: {
						userId: buyer.id,
					},
				}),
			);

			expect(sellerCountWithoutReference).toBe(3);
			expect(sellerCountForDraft).toBe(3);
			expect(buyerCountWithoutReference).toBe(2);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
