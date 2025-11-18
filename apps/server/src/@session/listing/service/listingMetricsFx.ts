import { Effect } from "effect";
import type { WithDatabase } from "../../../database/WithDatabase";
import { NotFoundError } from "../../../error/NotFoundError";
import { ListingMetricsSchema } from "../schema/ListingMetricsSchema";

export namespace listingMetricsFx {
	export interface Props {
		database: WithDatabase;
		listingId: string;
	}
}

export const listingMetricsFx = ({ database, listingId }: listingMetricsFx.Props) => {
	return Effect.gen(function* () {
		const count = yield* Effect.promise(async () => {
			return database
				.selectFrom("listing_score as ls")
				.select((eb) => [
					eb.fn.count<number>("ls.id").as("count"),
				])
				.where("ls.listingId", "=", listingId)
				.executeTakeFirstOrThrow();
		});

		if (Number(count.count) === 0) {
			return yield* new NotFoundError({
				resource: "listing",
				resourceId: listingId,
				message: "Listing has no score yet",
			});
		}

		const score = yield* Effect.promise(async () => {
			return database
				.selectFrom("listing_score as ls")
				.where("ls.listingId", "=", listingId)
				.select((eb) => [
					eb.fn
						.sum<number>(
							eb.case().when("ls.type", "=", "listing").then(1).else(0).end(),
						)
						.as("listing"),
					eb.fn
						.sum<number>(
							eb
								.case()
								.when("ls.type", "=", "listing")
								.then(eb.ref("ls.score"))
								.else(0)
								.end(),
						)
						.as("listingScore"),
					//
					eb.fn
						.sum<number>(eb.case().when("ls.type", "=", "view").then(1).else(0).end())
						.as("views"),
					eb.fn
						.sum<number>(
							eb
								.case()
								.when("ls.type", "=", "view")
								.then(eb.ref("ls.score"))
								.else(0)
								.end(),
						)
						.as("viewsScore"),
					//
					eb.fn
						.sum<number>(eb.case().when("ls.type", "=", "cart").then(1).else(0).end())
						.as("cart"),
					eb.fn
						.sum<number>(
							eb
								.case()
								.when("ls.type", "=", "cart")
								.then(eb.ref("ls.score"))
								.else(0)
								.end(),
						)
						.as("cartScore"),
					//
					eb.fn
						.sum<number>(eb.case().when("ls.type", "=", "ignore").then(1).else(0).end())
						.as("ignore"),
					eb.fn
						.sum<number>(
							eb
								.case()
								.when("ls.type", "=", "ignore")
								.then(eb.ref("ls.score"))
								.else(0)
								.end(),
						)
						.as("ignoreScore"),
					//
					eb.fn
						.sum<number>(eb.case().when("ls.type", "=", "flag").then(1).else(0).end())
						.as("flag"),
					eb.fn
						.sum<number>(
							eb
								.case()
								.when("ls.type", "=", "flag")
								.then(eb.ref("ls.score"))
								.else(0)
								.end(),
						)
						.as("flagScore"),
					eb.fn.sum<number>("ls.score").as("score"),
				])
				.executeTakeFirst();
		});

		return ListingMetricsSchema.parse(score);
	});
};

export type listingMetricsFx = ReturnType<typeof listingMetricsFx>;
