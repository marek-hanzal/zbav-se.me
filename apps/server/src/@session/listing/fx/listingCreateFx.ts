import { embedMinHash, embedNumberRange } from "@use-pico/common/embedding";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { DateTime } from "luxon";
import pgvector from "pgvector";
import { match } from "ts-pattern";
import { DatabaseContextFx } from "../../../fx/DatabaseContextFx";
import { UserContextFx } from "../../../fx/UserContextFx";
import { galleryCreateFx } from "../../gallery/fx/galleryCreateFx";
import type { ListingCreateSchema } from "../schema/ListingCreateSchema";
import { listingFetchFx } from "./listingFetchFx";

export namespace listingCreateFx {
	export interface Props {
		data: ListingCreateSchema.Type;
	}
}

export const listingCreateFx = ({ data }: listingCreateFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		const id = genId();
		const now = new Date();

		yield* Effect.tryPromise(async () => {
			return database
				.insertInto("listing")
				.values({
					id,
					userId: user.id,
					price: data.price,
					priceVec: pgvector.toSql([
						data.price,
					]),
					condition: data.condition,
					conditionVec: pgvector.toSql(
						embedNumberRange({
							min: 0,
							max: 6,
							value: data.condition,
						}),
					),
					age: data.age,
					ageVec: pgvector.toSql(
						embedNumberRange({
							min: 0,
							max: 6,
							value: data.age,
						}),
					),
					locationId: data.locationId,
					categoryId: data.categoryId,
					createdAt: now,
					updatedAt: now,
					currency: data.currency,
					title: data.title,
					titleVec: pgvector.toSql(
						embedMinHash({
							value: data.title,
						}),
					),
					description: data.description,
					expiresAt: match(data.expiresAt)
						.with("7-days", () =>
							DateTime.now()
								.plus({
									days: 7,
								})
								.toJSDate(),
						)
						.with("14-days", () =>
							DateTime.now()
								.plus({
									days: 14,
								})
								.toJSDate(),
						)
						.with("1-month", () =>
							DateTime.now()
								.plus({
									months: 1,
								})
								.toJSDate(),
						)
						.exhaustive(),
				})
				.execute();
		});

		yield* galleryCreateFx({
			listingId: id,
			uploadIds: data.uploadIds,
		});

		return yield* listingFetchFx({
			query: {
				where: {
					id,
					withOwn: true,
				},
			},
		});
	});
};

export type listingCreateFx = ReturnType<typeof listingCreateFx>;
