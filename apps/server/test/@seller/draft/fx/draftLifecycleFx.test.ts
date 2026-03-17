import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { draftCreateFx } from "~/@seller/draft/fx/draftCreateFx";
import { draftPatchFx } from "~/@seller/draft/fx/draftPatchFx";
import { listingCreateFx } from "~/@seller/listing/fx/listingCreateFx";
import { categoryFetchFx } from "~/@session/category/fx/categoryFetchFx";
import { locationAutocompleteFx } from "~/@session/location/fx/locationAutocompleteFx";
import { uploadCreateFx } from "~/@user/upload/fx/uploadCreateFx";
import { auth } from "~/auth/auth";
import { withRuntimeFx } from "~test/fixture/transactionFixture";
import { testabase } from "~test/testabase";

describe("draft lifecycle", () => {
	it("draft creates with gallery, usedAt is null", async () => {
		const database = await testabase("draft-create-basic");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@draft-create.cz",
				name: "Seller",
				password: "12345678",
			},
		});

		const draft = await Effect.gen(function* () {
			return yield* draftCreateFx({
				userId: seller.id,
				title: "Draft title",
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		expect(draft.galleryId).toBeDefined();
		expect(draft.usedAt).toBeNull();

		// Gallery record must exist
		const gallery = await database.kysely
			.selectFrom("gallery")
			.select("id")
			.where("id", "=", draft.galleryId)
			.executeTakeFirst();

		expect(gallery).toBeDefined();
	});

	it("draft with uploads creates gallery items in order", async () => {
		const database = await testabase("draft-create-with-uploads");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@draft-uploads.cz",
				name: "Seller",
				password: "12345678",
			},
		});

		const draft = await Effect.gen(function* () {
			const upload1 = yield* uploadCreateFx({
				url: "https://cdn.zbav-se.me/test1.jpg",
				userId: seller.id,
			});
			const upload2 = yield* uploadCreateFx({
				url: "https://cdn.zbav-se.me/test2.jpg",
				userId: seller.id,
			});

			return yield* draftCreateFx({
				userId: seller.id,
				title: "Draft with uploads",
				uploadIds: [
					upload1.id,
					upload2.id,
				],
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const galleryItems = await database.kysely
			.selectFrom("gallery_item")
			.select([
				"uploadId",
				"sort",
			])
			.where("galleryId", "=", draft.galleryId)
			.orderBy("sort", "asc")
			.execute();

		expect(galleryItems).toHaveLength(2);
		expect(galleryItems[0]?.sort).toBe(0);
		expect(galleryItems[1]?.sort).toBe(1);
	});

	it("patch draft updates fields and updatedAt, usedAt stays null", async () => {
		const database = await testabase("draft-patch");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@draft-patch.cz",
				name: "Seller",
				password: "12345678",
			},
		});

		const draft = await Effect.gen(function* () {
			return yield* draftCreateFx({
				userId: seller.id,
				title: "Original title",
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const patched = await Effect.gen(function* () {
			return yield* draftPatchFx({
				patch: {
					title: "Updated title",
					price: 999,
				},
				query: {
					where: {
						id: draft.id,
					},
				},
				scope: {
					userId: seller.id,
				},
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		expect(patched.title).toBe("Updated title");
		expect(Number(patched.price)).toBe(999);
		expect(patched.usedAt).toBeNull();
		expect(patched.updatedAt.getTime()).toBeGreaterThanOrEqual(draft.updatedAt.getTime());
	});

	it("creating listing with draftId marks draft.usedAt", async () => {
		const database = await testabase("draft-to-listing");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@draft-to-listing.cz",
				name: "Seller",
				password: "12345678",
			},
		});

		const { draft, listing } = await Effect.gen(function* () {
			const category = yield* categoryFetchFx({
				where: {
					slug: "pocitace-a-kancelar--uloziste-ssd-hdd",
				},
				scope: {},
			});

			const location = yield* locationAutocompleteFx({
				lang: "cs",
				text: "Praha",
				limit: 1,
			});

			const upload = yield* uploadCreateFx({
				url: "https://cdn.zbav-se.me/test.jpg",
				userId: seller.id,
			});

			const createdDraft = yield* draftCreateFx({
				userId: seller.id,
				title: "Draft ready for listing",
			});

			const createdListing = yield* listingCreateFx({
				userId: seller.id,
				draftId: createdDraft.id,
				title: "Listing from draft",
				price: 500,
				priceType: "open",
				condition: 1,
				age: 1,
				restriction: "none",
				expiresAt: "1-month",
				categoryId: category.id,
				// biome-ignore lint/style/noNonNullAssertion: asserted by locationAutocompleteFx
				locationId: location[0]!.id,
				uploadIds: [
					upload.id,
				],
			});

			return {
				draft: createdDraft,
				listing: createdListing,
			};
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		// Listing was created with status live
		expect(listing.status).toBe("live");

		// draft.usedAt must be set after listing creation
		const updatedDraft = await database.kysely
			.selectFrom("draft")
			.select([
				"usedAt",
				"updatedAt",
			])
			.where("id", "=", draft.id)
			.executeTakeFirstOrThrow();

		expect(updatedDraft.usedAt).not.toBeNull();

		// "listing.create" is in userEventCreateFx ignored list — intentionally not persisted
	});

	it("creating listing without draftId does not set usedAt on any draft", async () => {
		const database = await testabase("listing-no-draft");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@listing-no-draft.cz",
				name: "Seller",
				password: "12345678",
			},
		});

		await Effect.gen(function* () {
			const category = yield* categoryFetchFx({
				where: {
					slug: "pocitace-a-kancelar--uloziste-ssd-hdd",
				},
				scope: {},
			});
			const location = yield* locationAutocompleteFx({
				lang: "cs",
				text: "Praha",
				limit: 1,
			});
			const upload = yield* uploadCreateFx({
				url: "https://cdn.zbav-se.me/test.jpg",
				userId: seller.id,
			});

			// Create draft but do NOT pass draftId to listingCreateFx
			yield* draftCreateFx({
				userId: seller.id,
				title: "Unused draft",
			});

			yield* listingCreateFx({
				userId: seller.id,
				title: "Listing without draft",
				price: 100,
				priceType: "open",
				condition: 1,
				age: 1,
				restriction: "none",
				expiresAt: "1-month",
				categoryId: category.id,
				// biome-ignore lint/style/noNonNullAssertion: asserted by locationAutocompleteFx
				locationId: location[0]!.id,
				uploadIds: [
					upload.id,
				],
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		// The draft should have usedAt = null (not touched)
		const draft = await database.kysely
			.selectFrom("draft")
			.select("usedAt")
			.where("userId", "=", seller.id)
			.executeTakeFirstOrThrow();

		expect(draft.usedAt).toBeNull();
	});
});
