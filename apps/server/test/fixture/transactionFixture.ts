import { Effect } from "effect";
import { transactionCreateFx } from "~/@buyer/transaction/fx/transactionCreateFx";
import { withTransactionContextFx } from "~/@common/transaction/context/withTransactionContextFx";
import { withUploadFx } from "~/@common/upload/context/withUploadFx";
import { listingCreateFx } from "~/@seller/listing/fx/listingCreateFx";
import { transactionAcceptFx } from "~/@seller/transaction/fx/transactionAcceptFx";
import { transactionResolveFx } from "~/@seller/transaction/fx/transactionResolveFx";
import { categoryFetchFx } from "~/@session/category/fx/categoryFetchFx";
import { locationAutocompleteFx } from "~/@session/location/fx/locationAutocompleteFx";
import { withLocationFx } from "~/@session/location/fx/withLocationFx";
import { uploadCreateFx } from "~/@user/upload/fx/uploadCreateFx";
import { withDateFx } from "~/database/fx/withDateFx";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { ServerGeoapifySchema } from "~/schema/env/ServerGeoapifySchema";
import type { testabase } from "~test/testabase";
import { withTestRuntimeFx } from "~test/withTestRuntimeFx";

export const withRuntimeFx = (database: Awaited<ReturnType<typeof testabase>>) => {
	const geoapifyConfig = ServerGeoapifySchema.parse(process.env);

	return <A, E, R>(eff: Effect.Effect<A, E, R>) =>
		eff.pipe(
			withKyselyFx(database),
			withDateFx,
			withTestRuntimeFx,
			withTransactionContextFx(),
			withLocationFx({
				api: "https://api.geoapify.com",
				autocomplete: "/v1/geocode/autocomplete",
				geoapifyToken: geoapifyConfig.SERVER_GEOAPIFY_TOKEN,
			}),
			withUploadFx({
				cdn: "https://cdn.zbav-se.me",
			}),
		);
};

export const createListingFx = (sellerId: string) =>
	Effect.gen(function* () {
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
			userId: sellerId,
		});

		return yield* listingCreateFx({
			age: 1,
			condition: 1,
			categoryId: category.id,
			expiresAt: "1-month",
			// biome-ignore lint/style/noNonNullAssertion: Asserted above via locationAutocompleteFx.
			locationId: location[0]!.id,
			price: 500,
			priceType: "open",
			restriction: "none",
			title: "Test listing",
			uploadIds: [
				upload.id,
			],
			userId: sellerId,
		});
	});

/**
 * Creates a basic scenario: listing + one transaction in "pending" state.
 */
export const createPendingScenarioFx = ({
	sellerId,
	buyerId,
}: {
	sellerId: string;
	buyerId: string;
}) =>
	Effect.gen(function* () {
		const listing = yield* createListingFx(sellerId);

		yield* transactionCreateFx({
			listingId: listing.id,
			userId: buyerId,
		});

		return {
			listingId: listing.id,
		};
	});

/**
 * Creates a scenario with transaction in "open" state (seller accepted).
 */
export const createOpenScenarioFx = ({
	sellerId,
	buyerId,
	database,
}: {
	sellerId: string;
	buyerId: string;
	database: Awaited<ReturnType<typeof testabase>>;
}) =>
	Effect.gen(function* () {
		const { listingId } = yield* createPendingScenarioFx({
			sellerId,
			buyerId,
		});

		const tx = yield* Effect.promise(() =>
			database.kysely
				.selectFrom("transaction")
				.select("id")
				.where("listingId", "=", listingId)
				.where("userId", "=", buyerId)
				.executeTakeFirstOrThrow(),
		);

		yield* transactionAcceptFx({
			transactionId: tx.id,
			userId: sellerId,
		});

		return {
			listingId,
			transactionId: tx.id,
		};
	});

/**
 * Creates a scenario with transaction in "resolved" state (seller resolved).
 */
export const createResolvedScenarioFx = ({
	sellerId,
	buyerId,
	database,
}: {
	sellerId: string;
	buyerId: string;
	database: Awaited<ReturnType<typeof testabase>>;
}) =>
	Effect.gen(function* () {
		const { listingId, transactionId } = yield* createOpenScenarioFx({
			sellerId,
			buyerId,
			database,
		});

		yield* transactionResolveFx({
			transactionId,
			userId: sellerId,
		});

		return {
			listingId,
			transactionId,
		};
	});
