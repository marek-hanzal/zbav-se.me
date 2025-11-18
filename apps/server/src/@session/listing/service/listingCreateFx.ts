import { embedMinHash, embedNumberRange } from "@use-pico/common/embedding";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { DateTime } from "luxon";
import pgvector from "pgvector";
import { match } from "ts-pattern";
import type { WithDatabase } from "../../../database/WithDatabase";
import { galleryCreateFx } from "../../gallery/service/galleryCreateFx";
import type { ListingCreateSchema } from "../schema/ListingCreateSchema";
import { listingFetchFx } from "./listingFetchFx";

export namespace listingCreateFx {
	export interface Props {
		database: WithDatabase;
		userId: string;
		data: ListingCreateSchema.Type;
	}
}

export const listingCreateFx = ({ database, userId, data }: listingCreateFx.Props) => {
	return Effect.gen(function* () {
		const id = genId();
		const now = new Date();

		yield* Effect.promise(async () => {
			return database
				.insertInto("listing")
				.values({
					id,
					userId,
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
			database,
			userId,
			listingId: id,
			uploadIds: data.uploadIds,
		});

		return yield* listingFetchFx({
			database,
			userId,
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
