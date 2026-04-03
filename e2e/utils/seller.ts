import { Effect } from "effect";
import { draftCreateFx } from "~/seller/draft/server/fx/draftCreateFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { uploadCreateFx } from "~/user/upload/server/fx/uploadCreateFx";
import type { TestDatabase } from "./database";
import { waitForRow } from "./database";

export type SeededDraft = Awaited<ReturnType<typeof draftCreateFx>>;

export async function seedPublishableDraft(database: TestDatabase, userId: string, title: string) {
	return Effect.gen(function* () {
		const category = yield* Effect.promise(() =>
			database.kysely
				.selectFrom("category")
				.select([
					"id",
				])
				.where("locale", "=", "cs")
				.orderBy("sort", "asc")
				.executeTakeFirstOrThrow(),
		);

		const location = yield* Effect.promise(() =>
			database.kysely
				.selectFrom("location")
				.select([
					"id",
				])
				.where("id", "=", "loc_test_praha")
				.executeTakeFirstOrThrow(),
		);

		const upload = yield* uploadCreateFx({
			userId,
			url: `https://cdn.zbav-se.me/e2e/${crypto.randomUUID()}.jpg`,
		});

		return yield* draftCreateFx({
			userId,
			title,
			description: "A compact test listing.",
			price: 1234,
			priceType: "closed",
			delivery: [
				"personal",
			],
			warranty: "no-warranty",
			restriction: "none",
			locationId: location.id,
			categoryId: category.id,
			expiresAt: "7-days",
			pros: [
				"Useful",
			],
			cons: [
				"Plain",
			],
			uploadIds: [
				upload.id,
			],
		});
	}).pipe(withRuntimeFx(database), Effect.runPromise);
}

export async function waitForListingByDraftId(database: TestDatabase, draftId: string) {
	return waitForRow(
		database,
		() =>
			database.kysely
				.selectFrom("listing")
				.select([
					"id",
				])
				.where("draftId", "=", draftId)
				.executeTakeFirst(),
		"Listing was not created in time.",
	);
}
